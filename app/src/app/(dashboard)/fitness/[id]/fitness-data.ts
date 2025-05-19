import { db } from "iara-shared/database";
import { reports, researches, researchViews, forms, users, fitness as fitnessTable } from "iara-shared/database/schema";
import { eq, and, inArray, count, countDistinct, isNull } from "iara-shared/node_modules/drizzle-orm";
import type { FitnessOvertimeData } from "~/components/fitness-overtime/fitness-overtime-graph";
import type { ReportViewProps } from "~/components/report/report-view";
import type { ReportHeaderProps } from "~/components/report/report-header";
import { auth } from "@clerk/nextjs/server";

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
        enableSwitch: true,
        formsLength: research?.forms.length,
        reports: report.data,
        research,
        totalViews: uniqueViews[0]?.uniqueViews || 0
    }
}

export type { ReportData };
