import { Producer } from '../queue/connection';

const researchQueueName = "researches"

export const producer = Producer.create(researchQueueName)
