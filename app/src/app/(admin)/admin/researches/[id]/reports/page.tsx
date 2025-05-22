import type React from "react"
import ReportView, { type ReportViewProps } from "~/components/report/report-view"
import ReportHeader, { type ReportHeaderProps } from "~/components/report/report-header"
import { db } from "iara-shared/database"
import { researches, reports, researchViews } from "iara-shared/database/schema"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"

type Props = {
    params: {
        id: string
    }
}

interface ReportData extends ReportViewProps, ReportHeaderProps { }

const reportData = async (researchId: string): Promise<ReportData | undefined> => {
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
        enableSwitch: false,
        formsLength: research?.forms.length,
        reports: report.data,
        research,
        totalViews: uniqueViews[0]?.uniqueViews || 0
    }
}

export default async function SurveyDashboard({ params }: Props) {
    const data = await reportData(params.id)

    if (!data) {
        return <div>No report or research found</div>
    }

    const { formsLength, research, totalViews, reports, categories, enableSwitch } = data

    return (
        <div>
            <ReportHeader formsLength={formsLength} research={research} reports={reports} totalViews={totalViews} />
            <ReportView reports={reports} research={research} categories={categories} enableSwitch={enableSwitch} />
        </div>
    )
}

