import { CopyLinkForm } from "./components/copy-link-form";
import { ProcessResearch } from "./components/process-research";
import { RemoveResearch } from "./components/remove-research";
import { db } from "iara-shared/database";
import { notFound } from "next/navigation";
import { formatters, relativeTime } from "~/lib/utils";
import { and, count, eq, isNull, countDistinct } from "iara-shared/node_modules/drizzle-orm";
import {
  forms,
  researchViews,
  researches,
  users,
} from "iara-shared/database/schema";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MoveRightIcon, PencilIcon, Search, UserCheck, EyeIcon, ClipboardListIcon } from "lucide-react";
import { ResearchStatusBadge } from "~/components/research/researchStatusBadge";
import { Card } from "~/components/ui/card";
import ResearchInteractionsCount from "~/components/research/researchInteractionsCount";


type Props = {
  params: {
    id: string;
  };
};

async function getResearchById(id: string) {
  const { userId } = auth();

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const [research] = await db
    .select({
      id: researches.id,
      title: researches.title,
      description: researches.description,
      status: researches.status,
      forms: count(forms.id),
      createdAt: researches.createdAt,
    })
    .from(researches)
    .leftJoin(forms, eq(forms.researchId, researches.id))
    .where(and(eq(researches.id, id), eq(researches.userId, user), isNull(researches.deletedAt)))
    .limit(1)
    .groupBy(researches.id);

  return research;
}

async function getViewCounts(id: string) {
  const uniqueViews = await db
    .select({
      uniqueViews: countDistinct(researchViews.sessionId),
    })
    .from(researchViews)
    .where(eq(researchViews.researchId, id));

  return uniqueViews[0]?.uniqueViews || 0;
}

export default async function ResearchPage({ params }: Props) {
  const research = await getResearchById(params.id);
  const totalViews = await getViewCounts(params.id);

  if (!research) {
    return notFound();
  }

  const isResearchInAnalysis = research.status === "ANALYSIS";
  const isResearchActive = research.status === "CREATED" || research.status === "OPENED";
  const isResearchFinished = research.status === "FINISHED";

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)]">
      <header className="pt-4 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6">
            <Button
              size="sm"
              variant="link"
              className="p-0 text-foreground inline-flex"
              asChild
            >
              <Link href="/dashboard">
                <span className="sr-only">
                  Voltar para a lista de relatórios
                </span>
                <ArrowLeftIcon className="size-10" />
              </Link>
            </Button>

            <h2 className="text-3xl font-semibold leading-tight">
              {research.title}
            </h2>

            <ResearchStatusBadge status={research.status} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">Visão Geral da Pesquisa</h3>
            </div>

            <p className="text-muted-foreground">{research.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                <p className="text-sm text-muted-foreground">Criado em:</p>
                <p className="font-medium">{formatters.date(research.createdAt)}</p>
                <p className="text-sm text-muted-foreground">
                  (Há {relativeTime(research.createdAt)})
                </p>
              </div>
              <div className="p-4 rounded-lg border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                <p className="text-sm text-muted-foreground">Situação:</p>
                {isResearchInAnalysis ? (
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-4">
                      <Search className="absolute inline-flex size-4 animate-ping opacity-75" />
                      <Search className="relative inline-flex size-4" />
                    </span>
                    <p className="font-medium">Em Análise</p>
                  </div>
                ) : (
                  <p className="font-medium">
                    <ResearchInteractionsCount formsLength={research.forms} totalViews={totalViews}  />
                  </p>
                )}

              </div>
            </div>
          </section>

          {isResearchActive && (
            <section className="space-y-4">
              <h3 className="text-xl font-medium">Compartilhe sua Pesquisa</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <CopyLinkForm research={research.id} status={research.status} />
                </div>
              </div>
            </section>
          )}

          {isResearchFinished && (
            <div className="text-balance space-y-4 bg-muted p-4 rounded-lg">
              <p className="text-sm">
                Sua pesquisa foi processada, você pode ver os seus resultados
                clicando no botão abaixo:
              </p>
              <Button className="gap-2 group" asChild>
                <Link href={`/researches/${research.id}/reports`}>
                  Ver Relatório{" "}
                  <MoveRightIcon className="size-4 group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Ações</h3>

          {isResearchInAnalysis ? (
            <>
              <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                A pesquisa está em análise. Este processo pode levar um tempo para concluir.
                Enquanto isso, apenas a opção de exclusão está disponível.
              </div>
              <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                <h4 className="font-medium">Excluir Pesquisa</h4>
                <p className="text-sm text-muted-foreground dark:text-white">
                  Remove permanentemente a pesquisa e todas as respostas associadas. Esta ação não poderá ser desfeita.
                </p>
                <RemoveResearch research={research.id} status={research.status} />
              </Card>
            </>
          ) : (
            <>
              {isResearchActive ? (
                <>
                  <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                    <h4 className="font-medium">Processar Pesquisa</h4>
                    <p className="text-sm text-muted-foreground dark:text-white">
                      Inicia o processamento da pesquisa para gerar o relatório. Após iniciar o processo, não será mais possível receber novas respostas.
                    </p>
                    <ProcessResearch research={research.id} status={research.status} />
                  </Card>

                  <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                    <h4 className="font-medium">Editar Pesquisa</h4>
                    <p className="text-sm text-muted-foreground dark:text-white">
                      Permite alterar as informações da pesquisa. As alterações serão visíveis apenas para as novas respostas.
                    </p>
                    <Button className="w-full gap-2 focus:hover-xl hover:shadow-xl transition-all text-yellow-500 border-yellow-500 bg-[#F8FAFC] dark:bg-sky-900 dark:hover:bg-sky-800 hover:text-yellow-500 shadow-md" variant="outline" asChild>
                      <Link href={`/researches/${research.id}/update`}>
                        <PencilIcon className="size-4" />
                        Editar
                      </Link>
                    </Button>
                  </Card>

                  <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                    <h4 className="font-medium">Excluir Pesquisa</h4>
                    <p className="text-sm text-muted-foreground dark:text-white">
                      Remove permanentemente a pesquisa e todas as respostas associadas. Esta ação não poderá ser desfeita.
                    </p>
                    <RemoveResearch research={research.id} status={research.status} />
                  </Card>
                </>
              ) : (
                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">Pesquisa Finalizada</h4>
                  <p className="text-sm text-muted-foreground">
                    Esta pesquisa já foi encerrada e seus resultados estão disponíveis.
                  </p>
                  <Button className="w-full gap-2" asChild>
                    <Link href={`/researches/${research.id}/reports`}>
                      Ver Relatório{" "}
                      <MoveRightIcon className="size-4" />
                    </Link>
                  </Button>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
