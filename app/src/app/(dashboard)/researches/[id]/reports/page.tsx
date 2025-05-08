import type React from "react"
import { db } from "iara-shared/database"
import { reports, researches, researchViews } from "iara-shared/database/schema"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"
import ReportView from "../components/report-view"

import ReportHeader from "~/components/report/reportHeader"

type Props = {
  params: {
    id: string
  }
}

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
      },
      forms: {
        columns: { id: true }
      }
    }
  })


  const uniqueViews = await db
    .select({
      uniqueViews: countDistinct(researchViews.sessionId),
    })
    .from(researchViews)
    .where(eq(researchViews.researchId, params.id));

  const totalViews = uniqueViews[0]?.uniqueViews || 0;


  if (!report || !research) {
    return <div>No report or research found</div>
  }

  const categoryList = research?.questions.flatMap((question) => question.categories)

  return (
    <div>
      <ReportHeader formsLength={research.forms.length} research={research} totalViews={totalViews}  />
      <ReportView reports={report.data} research={research} categories={categoryList} enableSwitch={true} />
    </div>
  )
}
