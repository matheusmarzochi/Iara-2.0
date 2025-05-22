import React from "react";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";

import { db } from "iara-shared/database";
import { fitness } from "iara-shared/database/schema";
import { users } from "iara-shared/database/schema/user";
import { isNull, inArray } from "iara-shared/node_modules/drizzle-orm";

async function getFitnessListWithUsers() {
  const fitnessList = await db
    .select()
    .from(fitness)
    .where(isNull(fitness.deletedAt));

  const userIds = fitnessList.map(fit => fit.userId);
  const userList = userIds.length
    ? await db.select().from(users).where(inArray(users.id, userIds))
    : [];

  const userMap = new Map(userList.map(user => [user.id, user]));

  return fitnessList.map(fit => ({
    ...fit,
    user: userMap.get(fit.userId) || null,
  }));
}

export default async function FitnessPage() {
  const fitnessList = await getFitnessListWithUsers();

  return (
    <div>
      <header className="mb-8 flex flex-col items-start gap-2 pt-4 md:pt-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fitness Over time</h1>
        </div>
      </header>
      <div className="mt-6">
        {fitnessList.length === 0 ? (
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded bg-[#F8FAFC] dark:bg-sky-900">
              <thead className="bg-blue-100 dark:bg-sky-800 text-blue-900 dark:text-blue-100 font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left whitespace-nowrap">Email</th>
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
                    <td className="px-4 py-2 whitespace-nowrap">
                      {fit.user?.email ?? <span className="text-muted-foreground">-</span>}
                    </td>
                    <td className="px-4 py-2 font-medium w-full">{fit.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {Array.isArray(fit.researches) ? fit.researches.length : 0}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/admin/fitness/${fit.id}`}
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

