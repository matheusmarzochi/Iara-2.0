import React from "react";
import Link from "next/link";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";

import { db } from "iara-shared/database";
import { fitness } from "iara-shared/database/schema";
import { eq } from "iara-shared/node_modules/drizzle-orm";

import { Button } from "~/components/ui/button";
import FitnessDashboardClient from "~/components/fitness-overtime/fitness-dashboard";
import type { ReportViewProps } from "~/components/report/report-view";
import type { ReportHeaderProps } from "~/components/report/report-header";
import { fitnessOvertimeData, reportViewData } from "./fitness-data";
import { DuplicateFitnessButton } from "./duplicate-fitness";

type Props = {
  params: {
    id: string
  }
}

interface ReportData extends ReportViewProps, ReportHeaderProps { }

export default async function SurveyDashboard({ params }: Props) {
  const [fitnessItem] = await db
    .select({ researches: fitness .researches, name: fitness .name })
    .from(fitness )
    .where(
      eq(fitness .id, params.id),
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
              <Link href="/admin/fitness">
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
        <div>
          <DuplicateFitnessButton fitnessId={params.id} />
        </div>
      </header>
      <FitnessDashboardClient
        fitnessData={fitnessData}
        reportViewDict={reportViewDict}
      />
    </div>
  );
}
