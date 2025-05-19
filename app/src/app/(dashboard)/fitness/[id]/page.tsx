import type React from "react";
import { format, differenceInDays, differenceInMonths } from "date-fns";

import { auth } from "@clerk/nextjs/server";

import { db } from "iara-shared/database";
import {
    reports,
    researches,
    researchViews,
    forms,
    users,
    fitness as fitnessTable,
} from "iara-shared/database/schema";
import {
    eq,
    and,
    inArray,
    count,
    countDistinct,
    isNull,
} from "iara-shared/node_modules/drizzle-orm";

import type { FitnessOvertimeData } from "~/components/fitness-overtime/fitness-overtime-graph";
import type { ReportViewProps } from "~/components/report/report-view";
import type { ReportHeaderProps } from "~/components/report/report-header";

import FitnessDashboardClient from "~/components/fitness-overtime/fitness-dashboard";
import EditFitnessForm from "~/components/fitness-overtime/edit-fitness-form";
import RemoveFitness from "~/components/fitness-overtime/remove-fitness"
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
        enableSwitch: true,
        formsLength: research?.forms.length,
        reports: report.data,
        research,
        totalViews: uniqueViews[0]?.uniqueViews || 0
    }
}

export default async function SurveyDashboard({ params }: Props) {
  const { userId } = auth();

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string))
    .limit(1);

  if (!user) {
    return <>Empty</>;
  }

  const [fitnessItem] = await db
    .select({ researches: fitnessTable.researches, name: fitnessTable.name })
    .from(fitnessTable)
    .where(
      and(
        eq(fitnessTable.id, params.id),
        eq(fitnessTable.userId, user.id)
      )
    )
    .limit(1);

  const researchList: string[] = Array.isArray(fitnessItem?.researches)
    ? fitnessItem.researches
    : [];

  const fitnessData = await fitnessOvertimeData(researchList);

  let periodText = "";
  if (fitnessData && fitnessData.length > 0) {
    const dates = fitnessData
      .map(d => d.research.createdAt)
      .filter(Boolean)
      .map(date => typeof date === "string" ? new Date(date) : date)
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length > 1) {
      const first = dates[0];
      const last = dates[dates.length - 1];
      const diffDays = differenceInDays(last, first);
      const diffMonths = differenceInMonths(last, first);

      let intervalText = "";
      if (diffMonths >= 2) {
        intervalText = `${diffMonths} meses`;
      } else {
        intervalText = `${diffDays} dias`;
      }

      periodText = `Período: ${format(first, "dd/MM/yyyy")} até ${format(last, "dd/MM/yyyy")} (${intervalText})`;
    } else if (dates.length === 1) {
      periodText = `Data: ${format(dates[0], "dd/MM/yyyy")}`;
    }
  }

  const reportViewDict: Record<string, ReportData | undefined> = {};
  for (const researchId of researchList) {
    reportViewDict[researchId] = await reportViewData(researchId);
  }

  const researchesListRaw = await db
    .select({
      id: researches.id,
      title: researches.title,
      formsCount: count(forms.id),
      createdAt: researches.createdAt,
    })
    .from(researches)
    .leftJoin(forms, eq(forms.researchId, researches.id))
    .where(
      and(
        eq(researches.userId, user.id),
        eq(researches.status, "FINISHED"),
        isNull(researches.deletedAt)
      )
    )
    .groupBy(researches.id);

  const researchesList = researchesListRaw.map(r => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }));

  const fitnessObj = {
    id: params.id,
    name: fitnessItem?.name ?? "",
    researches: Array.isArray(fitnessItem?.researches) ? fitnessItem.researches : [],
  };

  if (!fitnessData) {
    return <>Empty</>;
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
           {fitnessItem.name}
          </h1>
          {periodText && (
            <div className="text-muted-foreground mt-1 text-base">{periodText}</div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <EditFitnessForm fitness={fitnessObj} researches={researchesList} />
          <RemoveFitness fitnessId={fitnessObj.id} />
        </div>
      </header>
      <FitnessDashboardClient
        fitnessData={fitnessData}
        reportViewDict={reportViewDict}
      />
    </div>
  );
}
