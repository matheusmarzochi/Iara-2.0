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
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { fitnessOvertimeData, reportViewData } from "./fitness-data";

type Props = {
  params: {
    id: string
  }
}

interface ReportData extends ReportViewProps, ReportHeaderProps { }

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
          {/* Linha com botão voltar e nome */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="link"
              className="p-0 text-foreground inline-flex"
              asChild
            >
              <Link href="/fitness">
                <span className="sr-only">
                  Voltar para a lista de fitness
                </span>
                <ArrowLeftIcon className="size-10" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">
              {fitnessItem.name}
            </h1>
          </div>
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
