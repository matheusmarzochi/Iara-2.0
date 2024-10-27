import { Consumer, Producer, researchQueueName } from 'iara-shared/queue'
import { getCategories } from '../prompt/categorization'
import { getClassification } from '../prompt/classification'
import { getReport } from '../report/process'

const researchProcessor = {
  async process(msg: string): Promise<boolean> {

    console.log(`Start processing ResearchID: ${msg}`)
    await getCategories(msg)
    await getClassification(msg)
    await getReport(msg)
    
    return true 
  }
}

export const consumer = Consumer.create(researchQueueName, researchProcessor, 3)
export const producer = Producer.create(researchQueueName)
