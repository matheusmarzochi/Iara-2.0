import React from "react";
import Link from "next/link";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { MoveRightIcon } from "lucide-react";

import { db } from "iara-shared/database";
import { fitness } from "iara-shared/database/schema";
import { users } from "iara-shared/database/schema/user";
import { researches, forms } from "iara-shared/database/schema";
import { eq, and, isNull, count } from "iara-shared/node_modules/drizzle-orm";

import { auth } from "@clerk/nextjs/server";
import CreateFitnessForm from "~/components/fitness-overtime/create-fitness-form";

async function getUserResearches(orderBy: "alpha" | "createdAt" = "createdAt") {
  const { userId } = auth();

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string))
    .limit(1);

  if (!user) return [];

  let order;
  if (orderBy === "alpha") {
    order = researches.title;
  } else {
    order = researches.createdAt;
  }

  const userResearches = await db
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
    .groupBy(researches.id)
    .orderBy(order);

  return userResearches;
}

async function getUserFitnessWithPeriod() {
  const { userId } = auth();

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string))
    .limit(1);

  if (!user) return [];

  const fitnessList = await db
    .select()
    .from(fitness)
    .where(
      and(
        eq(fitness.userId, user.id),
        isNull(fitness.deletedAt)
      )
    );

  const researchesMap: Record<string, { createdAt: Date | string }[]> = {};

  const allResearches = await db
    .select({
      id: researches.id,
      createdAt: researches.createdAt,
    })
    .from(researches)
    .where(
      and(
        eq(researches.userId, user.id),
        eq(researches.status, "FINISHED"),
        isNull(researches.deletedAt)
      )
    );

  for (const fit of fitnessList) {
    const researchIds = Array.isArray(fit.researches) ? fit.researches : [];
    researchesMap[fit.id] = allResearches.filter(r => researchIds.includes(r.id));
  }

  const fitnessWithPeriod = fitnessList.map(fit => {
    const researchDates = (researchesMap[fit.id] || [])
      .map(r => typeof r.createdAt === "string" ? new Date(r.createdAt) : r.createdAt)
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime());

    let periodText = "-";
    if (researchDates.length > 1) {
      const first = researchDates[0];
      const last = researchDates[researchDates.length - 1];
      const diffDays = differenceInDays(last, first);
      const diffMonths = differenceInMonths(last, first);

      let intervalText = "";
      if (diffMonths >= 2) {
        intervalText = `${diffMonths} meses`;
      } else {
        intervalText = `${diffDays} dias`;
      }

      periodText = `${format(first, "dd/MM/yyyy")} até ${format(last, "dd/MM/yyyy")} (${intervalText})`;
    } else if (researchDates.length === 1) {
      periodText = `Data: ${format(researchDates[0], "dd/MM/yyyy")}`;
    }

    return {
      ...fit,
      periodText,
      researches: researchesMap[fit.id] || [],
    };
  });

  return fitnessWithPeriod;
}

export default async function FitnessPage({ searchParams }: { searchParams?: { order?: string } }) {
  const fitnessList = await getUserFitnessWithPeriod();
  const researchesListRaw = await getUserResearches("createdAt");
  const researchesList = researchesListRaw.map(r => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }));

  return (
    <div>
      <header className="mb-8 flex flex-col items-start gap-2 pt-4 md:pt-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fitness Over time</h1>
        </div>
        <CreateFitnessForm researches={researchesList} />
      </header>
      <div className="mt-6">
        {fitnessList.length === 0 ? (
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded bg-[#F8FAFC] dark:bg-sky-900">
              <thead className="bg-blue-100 dark:bg-sky-800 text-blue-900 dark:text-blue-100 font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left w-full">Nome</th>
                  <th className="px-4 py-2 text-left sm:table-cell hidden whitespace-nowrap">Período (duração)</th>
                  <th className="px-4 py-2 text-left sm:hidden table-cell whitespace-nowrap">Duração</th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">Pesquisas</th>
                  <th className=""/>
                </tr>
              </thead>
              <tbody>
                {fitnessList.map((fit) => (
                  <tr key={fit.id} className="border-t">
                    <td className="px-4 py-2 font-medium w-full">{fit.name}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground sm:table-cell hidden whitespace-nowrap">
                      {fit.periodText}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground sm:hidden table-cell">
                      {(() => {
                        if (!fit.periodText || fit.periodText === "-") return "-";

                        const match = fit.periodText.match(/\(([^)]+)\)/);
                        if (match) return match[1];

                        const durationMatch = fit.periodText.match(/(\d+\s+(dias|meses))/);
                        if (durationMatch) return durationMatch[1];

                        if (fit.periodText.startsWith("Data:")) return "1 dia";
                        return fit.periodText;
                      })()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {Array.isArray(fit.researches) ? fit.researches.length : 0}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/fitness/${fit.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded border bg-white dark:bg-sky-900 hover:bg-blue-50 dark:hover:bg-sky-800 text-blue-600 dark:text-blue-300 text-sm font-medium transition"
                      >
                        <span className="sm:inline hidden">Acessar Relatório</span>
                        <MoveRightIcon className="size-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

