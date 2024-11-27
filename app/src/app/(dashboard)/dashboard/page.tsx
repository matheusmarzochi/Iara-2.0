import { auth } from "@clerk/nextjs/server";
import { count, desc, eq } from "iara-shared/node_modules/drizzle-orm";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "iara-shared/database";
import {
  forms,
  type Research,
  researches,
  users,
} from "iara-shared/database/schema";
import { cn, formatters } from "~/lib/utils";
import { EditIcon } from "lucide-react";

type ResearchGroup = Record<Research["status"], Array<Research>>;

async function getUserResearchs() {
  const { userId } = auth();

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const researchs = await db
    .select({
      id: researches.id,
      title: researches.title,
      status: researches.status,
      createdAt: researches.createdAt,
      replies: count(forms.id),
    })
    .from(researches)
    .leftJoin(forms, eq(forms.researchId, researches.id))
    .where(eq(researches.userId, user))
    .orderBy(desc(researches.createdAt))
    .groupBy(researches.id);

  return researchs;
}

export default async function DashboardPage() {
  const researchs = await getUserResearchs();

  const researchStatus = (status: Research["status"]) =>
    ({
      CREATED: (
        <Badge className="whitespace-nowrap w-fit bg-yellow-500 text-black">
          Em Andamento
        </Badge>
      ),
      FINISHED: (
        <Badge className="whitespace-nowrap w-fit bg-green-400 text-black">
          Encerrada
        </Badge>
      ),
      PROCESSING: (
        <Badge className="whitespace-nowrap w-fit bg-orange-500 text-black">
          Processando
        </Badge>
      ),
    })[status];

  const researchStatusTitle = (status: Research["status"]) =>
    ({
      CREATED: <h3 className="font-bold text-2xl">Em Andamento</h3>,
      PROCESSING: <h3 className="font-bold text-2xl">Em Processamento</h3>,
      FINISHED: <h3 className="font-bold text-2xl">Encerrado</h3>,
    })[status];

  const researchsByStatus = researchs.reduce(
    (researchs, research) => {
      // @ts-expect-error research type
      researchs[research.status].push(research);

      return researchs;
    },
    { CREATED: [], PROCESSING: [], FINISHED: [] } as ResearchGroup,
  );

  return (
    <>
      <section className="flex flex-col items-end md:items-start pt-4 pb-8 gap-6">
        <Button size="sm" className="order-1 md:order-2" asChild>
          <Link href="/researchs/new">Criar Formulário</Link>
        </Button>

        {researchs.length <= 0 ? (
          <section className="order-2 md:order-1">
            <p className="text-muted-foreground">
              Você não possui nenhum formulário. Clique em “Criar formulário”
              para descobrir as necessidades e expectativas dos seus clientes!
            </p>
          </section>
        ) : null}
      </section>

      <section className="space-y-10">
        {Object.keys(researchsByStatus)
          // @ts-expect-error type status
          .filter((key: Research["status"]) =>
            Boolean(researchsByStatus[key].length),
          )
          // @ts-expect-error type status
          .map((status: Research["status"]) => {
            return (
              <div key={status} className="space-y-6">
                {researchStatusTitle(status)}

                <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
                  {researchsByStatus[status].map((research) => {
                    const researchURL =
                      status === "FINISHED"
                        ? `/researchs/${research.id}/reports`
                        : `/researchs/${research.id}`;

                    return (
                      <Card
                        key={research.id}
                        className="relative shadow-md focus:hover-xl hover:shadow-xl transition-all bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">
                              {research.title}
                            </CardTitle>
                            {researchStatus(research.status)}
                          </div>
                        </CardHeader>

                        <CardContent className="flex items-end justify-between">
                          <div>
                            <p className="text-sm">
                              Criado em: {formatters.date(research.createdAt)}
                            </p>
                            <p className="text-sm">
                              {/* @ts-expect-error replies type is missing */}
                              Respostas: {research.replies}
                            </p>
                          </div>

                          {research.status !== "FINISHED" ? (
                            <Button
                              asChild
                              size="icon"
                              variant="ghost"
                              className="p-0 size-8 z-10 relative"
                            >
                              <Link href={`/researchs/${research.id}/update`}>
                                <EditIcon className="size-4" />
                              </Link>
                            </Button>
                          ) : null}
                        </CardContent>

                        <Link className="absolute inset-0" href={researchURL} />
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </section>
    </>
  );
}
