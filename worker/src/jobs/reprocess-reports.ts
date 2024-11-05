import { db } from 'iara-shared/database' 
import { researches } from 'iara-shared/database/schema' 
import { eq } from 'iara-shared/node_modules/drizzle-orm' 
import { getReport } from '../report/process'

const DRY_RUN = !(process.env.DRY_RUN === 'false')

const reprocessResearches = async() => {

    if (DRY_RUN) {
        console.log("DRY RUN mode enabled")
    }

    const researchsIds = await db.query.researches.findMany({
        where: eq(researches.status, "FINISHED"),
        columns: {
            id: true
        }
    })

    for (const research of researchsIds) {
        console.log(`Research: ${research.id}`)
        if (!DRY_RUN) {
            await getReport(research.id)
        }
    }

    console.log(`Researches affected: ${researchsIds.length}`)
    process.exit()
}

reprocessResearches()
