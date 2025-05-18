import type React from "react"
import { db } from "iara-shared/database"
import { auth } from "@clerk/nextjs/server";
import { reports, researches, researchViews, users } from "iara-shared/database/schema"
import { eq, and, inArray, countDistinct } from "iara-shared/node_modules/drizzle-orm"
import type { FitnessOvertimeData } from "~/components/fitness-overtime/fitness-overtime-graph"
import type { ReportViewProps } from "~/components/report/report-view"
import type { ReportHeaderProps } from "~/components/report/report-header"
import FitnessDashboardClient from "./FitnessDashboardClient"

type Props = {
  params: {
    id: string
  }
}

interface ReportData extends ReportViewProps, ReportHeaderProps { }

export const fitnessOvertimeData = async (researchList: string[]): Promise<FitnessOvertimeData[] | undefined> => {

    const { userId } = auth();

    const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, userId as string));


    const research = await db.query.researches.findMany({
        where: and(
            inArray(researches.id, researchList),
            eq(researches.userId, user[0].id)
        ),
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



    if (!research || research.length === 0) {
        return undefined
    }

    const reportList = await db.query.reports.findMany({
        where: inArray(reports.researchId, researchList),
    })

    if (!reportList || reportList.length === 0) {
        return undefined
    }

    const fitnessOvertimeData: FitnessOvertimeData[] = research.map(research => {
        const reportItem = reportList.find(r => r.researchId === research.id);
        return {
            research: { title: research.title, id: research.id, createdAt: research.createdAt },
            report: reportItem ? reportItem.data : []
        };
    }).filter(r => r.report.length > 0);

    return fitnessOvertimeData
}



export const reportViewData = async (researchId: string): Promise<ReportData | undefined> => {

    const { userId } = auth();

    const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, userId as string));

    const research = await db.query.researches.findFirst({
        where: and(eq(researches.id, researchId), eq(researches.userId, user[0].id)),
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
        enableSwitch: true, // Enable the user to edit the targetCategory
        formsLength: research?.forms.length,
        reports: report.data,
        research,
        totalViews: uniqueViews[0]?.uniqueViews || 0
    }
}

export default async function SurveyDashboard({ params }: Props) {
  const researchList = [
    '9c8d4ad5-41ec-49ad-a70b-3e6ffaf4ca93',
    '5a68bd3c-3c37-4e57-a9cb-18a7ee460a1c',
    '957f054b-d966-4b16-8c4f-b03bda2c123e',
    '027f2061-a4fd-4d5e-921f-e9d1cc1bf746',
    'beb1cd8a-3704-45b5-88cd-b9f6e5fdeac7',
    '6531dc2c-63a9-4836-b98e-8d4ed047baf1',
    '68817bf6-4d17-4114-a956-6713481b9e8f',
    'f9867e6a-3693-4774-95e2-66a6534c03cc',
    '2555cf78-9378-4c5b-994e-869947c0f02d',

    '00b000f4-e3e0-4591-851c-ca1c2e570d3f',
    '103d21b7-ee1f-4737-baf1-31ee067608d9',
    'f1fc2a4f-59f9-4d10-b95f-07aaf24fe62f',
    '3747256a-b540-4538-85a1-58aba261c54f'
  ]

  const fitnessData = await fitnessOvertimeData(researchList)

  const reportViewDict: Record<string, ReportData | undefined> = {}
  for (const researchId of researchList) {
    reportViewDict[researchId] = await reportViewData(researchId)
  }

  if (!fitnessData) {
    return <>Empty</>
  }

  return (
    <FitnessDashboardClient
      fitnessData={fitnessData}
      reportViewDict={reportViewDict}
    />
  )
}
