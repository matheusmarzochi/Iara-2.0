import amqp, { Connection, Channel, Message } from 'amqplib';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export interface MessageProcessor {
    process(msg: string): Promise<boolean>;
}

class ConnectionManager {
    private static instance: ConnectionManager;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

    private constructor() { }

    public static getInstance(): ConnectionManager {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }

    public async getConnection(): Promise<Connection> {
        if (!this.connection) {
            this.connection = await amqp.connect(this.RABBITMQ_URL);
        }
        return this.connection;
    }

    public async getChannel(): Promise<Channel> {
        if (!this.channel) {
            const connection = await this.getConnection();
            this.channel = await connection.createChannel();
        }
        return this.channel;
    }
}


class Consumer {
    private queueName: string;
    private handle: MessageProcessor;
    private maxConcurrent: number;
    private activeCount: number;
    private requeueDelay: number; // delay in milliseconds before re-queuing

    private constructor(queueName: string, handle: MessageProcessor, requeueDelay: number) {
        this.queueName = queueName;
        this.handle = handle;
        this.maxConcurrent = parseInt(process.env.QUEUE_MAX_CONCURRENT || '1', 10); // Fetch from env or use default
        this.requeueDelay = requeueDelay;
        this.activeCount = 0;
    }

    public static create(queueName: string, handle: MessageProcessor, requeueDelay: number = 5000): Consumer {
        return new Consumer(queueName, handle, requeueDelay);
    }

    public async start(): Promise<void> {
        try {
            const connectionManager = ConnectionManager.getInstance();
            const channel = await connectionManager.getChannel();

            await channel.assertQueue(this.queueName, {
                durable: true,
            });

            console.log(`Waiting for messages in ${this.queueName}. To exit press CTRL+C`);
            console.log(`Max concurrent processing set to: ${this.maxConcurrent}`);

            channel.consume(this.queueName, async (msg: Message | null) => {
                if (msg !== null) {
                    // Only proceed if we're under the max concurrency limit
                    if (this.activeCount < this.maxConcurrent) {
                        this.activeCount++;
                        const messageContent = msg.content.toString();
                        console.log(`Received message at ${this.queueName}`);

                        try {
                            const result = await this.handle.process(messageContent);

                            if (result) {
                                channel.ack(msg);
                            } else {
                                console.error(`Failed to process message at ${this.queueName}`);
                            }
                        } catch (error) {
                            console.error(`Error processing message at ${this.queueName}:`, error);
                        } finally {
                            // Decrement active count when processing completes
                            this.activeCount--;
                        }
                    } else {
                        // Wait before re-queuing if we're at max concurrency
                        await this.sleep(this.requeueDelay);
                        channel.nack(msg, false, true);
                    }
                }
            }, {
                noAck: false
            });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Producer {
    private queueName: string;

    private constructor(queueName: string) {
        this.queueName = queueName;
    }

    public static create(queueName: string): Producer {
        return new Producer(queueName);
    }

    public async send(message: string): Promise<void> {
        try {
            const connectionManager = ConnectionManager.getInstance();
            const channel = await connectionManager.getChannel();

            await channel.assertQueue(this.queueName, {
                durable: true,
            });

            await channel.sendToQueue(this.queueName, Buffer.from(message));
            console.log(`Message sent to queue ${this.queueName}: ${message}`);
        } catch (error) {
            console.error('Error producing message:', error);
        }
        await sleep(100);
    }
}

export {
    Producer,
    Consumer
}

