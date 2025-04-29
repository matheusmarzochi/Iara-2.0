import type React from "react"
import { db } from "iara-shared/database"
import { reports, researches, categories } from "iara-shared/database/schema"
import { eq } from "iara-shared/node_modules/drizzle-orm"
import ReportView from "../components/report-view"

type Props = {
  params: {
    id: string
  }
}

// Server component wrapper
export default async function SurveyDashboard({ params }: Props) {
  const report = await db.query.reports.findFirst({
    where: eq(reports.researchId, params.id),
  })

  const research = await db.query.researches.findFirst({
    where: eq(researches.id, params.id),
    with: {
      questions: {
        with: {
          categories: {
            with: {
              analysis: true
            }
          }
        }
      }
    }
  })

  if (!report || !research) {
    return <div>No report or research found</div>
  }

  

  const categoryList = research?.questions.map((question) => question.categories).flat()
  console.log(categoryList)

  return <ReportView reports={report.data} research={research} categories={categoryList} />
}
