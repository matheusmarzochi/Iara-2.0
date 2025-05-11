import type React from "react"
<<<<<<< Updated upstream
import { db } from "iara-shared/database"
import { reports, researches, researchViews } from "iara-shared/database/schema"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"
import ReportView from "~/app/(dashboard)/researches/[id]/components/report-view"
import ReportHeader from "~/components/report/reportHeader"


=======
import ReportView, { ReportViewProps } from "~/components/report/report-view"
import ReportHeader, { ReportHeaderProps } from "~/components/report/report-header"
import { db } from "iara-shared/database"
import { researches, reports, researchViews } from "iara-shared/database/schema"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"
>>>>>>> Stashed changes
type Props = {
  params: {
    id: string
  }
}

<<<<<<< Updated upstream
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
      },
      forms: {
        columns: {
          id: true
        }
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
=======
interface ReportData extends ReportViewProps, ReportHeaderProps {}

export const reportData = async (researchId: string): Promise<ReportData | undefined> => {
    "use server"

    const research = await db.query.researches.findFirst({
        where: eq(researches.id, researchId),
        with: {
            forms: {
                columns: {
                    id: true
                }
            },
            questions: {
                with: {
                    categories: true
                }
            }
        }
    })

    if (!research) {
        return undefined
    }

    const categoryList = research.questions.flatMap((question) => question.categories)

    const report = await db.query.reports.findFirst({
        where: eq(reports.researchId, researchId),
    })

    if (!report) {
        return undefined
    }

    const uniqueViews = await db
        .select({
            uniqueViews: countDistinct(researchViews.sessionId),
        })
        .from(researchViews)
        .where(eq(researchViews.researchId, researchId));

    return {
        categories: categoryList,
        enableSwitch: false, // Admin always false to prevent update targetSwitch
        formsLength: research?.forms.length,
        reports: report.data,
        research,
        totalViews: uniqueViews[0]?.uniqueViews || 0

    }
}

export default async function SurveyDashboard({ params }: Props) {
  const data = await reportData(params.id)
>>>>>>> Stashed changes

  if (!data) {
    return <div>No report or research found</div>
  }

<<<<<<< Updated upstream
  const categoryList = research?.questions.flatMap((question) => question.categories)

  // Cabeçalho igual ao ReportsPage
  return (
    <div>
      <ReportHeader formsLength={research.forms.length} research={research} totalViews={totalViews} />
      <ReportView reports={report.data} research={research} categories={categoryList} enableSwitch={true} />
=======
  const { formsLength, research, totalViews, reports, categories, enableSwitch } = data
  
  return (
    <div>
      <ReportHeader formsLength={formsLength} research={research} totalViews={totalViews} />
      <ReportView reports={reports} research={research} categories={categories} enableSwitch={enableSwitch} />
>>>>>>> Stashed changes
    </div>
  )
}

