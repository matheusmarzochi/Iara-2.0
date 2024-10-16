import { Producer, Consumer } from '../queue/connection';
import { getCategories } from '../prompt/categorization'
import { getClassification } from '../prompt/classification'

const researchQueueName = "researches"

const researchProcessor = {
  async process(msg: string): Promise<boolean> {

    console.log(`Start processing ResearchID: ${msg}`)
    await getCategories(msg)
    await getClassification(msg)
    
    return true 
  }
}

export const consumer = Consumer.create(researchQueueName, researchProcessor)
export const producer = Producer.create(researchQueueName)
