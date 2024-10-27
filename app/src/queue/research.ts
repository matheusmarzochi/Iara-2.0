import { Producer } from 'iara-shared/queue/connection';

const researchQueueName = "researches"

export const producer = Producer.create(researchQueueName)
