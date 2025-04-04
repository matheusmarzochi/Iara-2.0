import { CopyLinkForm } from "./components/copy-link-form";
import { ProcessResearch } from "./components/process-research";
import { RemoveResearch } from "./components/remove-research";
import { db } from "iara-shared/database";
import { notFound } from "next/navigation";
import { formatters, relativeTime } from "~/lib/utils";
import { and, count, eq, isNull } from "iara-shared/node_modules/drizzle-orm";
import {
  forms,
  type Research,
  researches,
  users,
} from "iara-shared/database/schema";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MoveRightIcon, Trash2Icon, PencilIcon, CpuIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";

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

export default async function ResearchPage({ params }: Props) {
  const research = await getResearchById(params.id);

  if (!research) {
    return notFound();
  }

  const isResearchActive = research.status === "CREATED";
  const isResearchFinished = research.status === "FINISHED";

  const status = (status: Research["status"]) =>
    ({
      CREATED: (
        <Badge className="whitespace-nowrap w-fit bg-yellow-500 text-black hover:bg-yellow-400">
          Em Andamento
        </Badge>
      ),
      FINISHED: (
        <Badge className="whitespace-nowrap w-fit bg-green-400 text-black hover:bg-green-300">
          Encerrada
        </Badge>
      ),
      PROCESSING: (
        <Badge className="whitespace-nowrap w-fit bg-orange-500 text-black hover:bg-orange-400">
          Processando
        </Badge>
      ),
    })[status];

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

            {status(research.status)}
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
                <p className="text-sm text-muted-foreground">Respostas:</p>
                <p className="font-medium">{research.forms}</p>
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
                <Link href={`/researchs/${research.id}/reports`}>
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

          {isResearchActive && (
            <>
              <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                <h4 className="font-medium">Processar Pesquisa</h4>
                <p className="text-sm text-muted-foreground dark:text-white">
                  Ao clicar, você encerrará a pesquisa, não aceitará mais respostas e iniciará a análise.
                  Os resultados serão mostrados após o processamento.
                </p>
                <ProcessResearch research={research.id} status={research.status} />
              </Card>

              <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                <h4 className="font-medium">Editar Pesquisa</h4>
                <p className="text-sm text-muted-foreground dark:text-white">
                  Mesmo comportamento do processamento - encerra a pesquisa, não aceita mais respostas e entra no processamento de resultados.
                </p>
                <Button className="w-full gap-2 focus:hover-xl hover:shadow-xl transition-all text-yellow-500 border-yellow-500 bg-[#F8FAFC] dark:bg-sky-900 dark:hover:bg-sky-800 hover:text-yellow-500 shadow-md" variant="outline" asChild>
                  <Link href={`/researchs/${research.id}/update`}>
                    <PencilIcon className="size-4" />
                    Editar
                  </Link>
                </Button>
              </Card>

              <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                <h4 className="font-medium">Excluir Pesquisa</h4>
                <p className="text-sm text-muted-foreground dark:text-white">
                  Exclui permanentemente a pesquisa e suas respostas, sem possibilidade de recuperação.
                </p>
                <RemoveResearch research={research.id} status={research.status} />
              </Card>
            </>
          )}

          {!isResearchActive && (
            <Card className="p-4 space-y-3">
              <h4 className="font-medium">Pesquisa Finalizada</h4>
              <p className="text-sm text-muted-foreground">
                Esta pesquisa já foi encerrada e seus resultados estão disponíveis.
              </p>
              <Button className="w-full gap-2" asChild>
                <Link href={`/researchs/${research.id}/reports`}>
                  Ver Relatório{" "}
                  <MoveRightIcon className="size-4" />
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
