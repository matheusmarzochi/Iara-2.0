import amqp, { Connection, Channel, Message } from 'amqplib';

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

    private constructor(queueName: string, handle: MessageProcessor) {
        this.queueName = queueName;
        this.handle = handle;
    }

    public static create(queueName: string, handle: MessageProcessor): Consumer {
        return new Consumer(queueName, handle);
    }

    public async start(): Promise<void> {
        try {
            const connectionManager = ConnectionManager.getInstance();
            const channel = await connectionManager.getChannel();

            await channel.assertQueue(this.queueName, {
                durable: true,
            });

            console.log(`Waiting for messages in ${this.queueName}. To exit press CTRL+C`);

            channel.consume(this.queueName, async (msg: Message | null) => {
                if (msg !== null) {
                    const messageContent = msg.content.toString();
                    console.log(`Received message at ${this.queueName}`);

                    const result = await this.handle.process(messageContent);

                    if (result) {
                        channel.ack(msg);
                    } else {
                        console.error(`Failed to process message at ${this.queueName}`);
                        // Optionally, you could handle failed processing here
                    }
                }
            }, {
                noAck: false
            });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
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

            channel.sendToQueue(this.queueName, Buffer.from(message));
            console.log(`Message sent to queue ${this.queueName}: ${message}`);
        } catch (error) {
            console.error('Error producing message:', error);
        }
    }
}

export {
    Producer,
    Consumer
}

