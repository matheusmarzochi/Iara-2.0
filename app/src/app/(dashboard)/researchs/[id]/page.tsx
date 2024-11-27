import { CopyLinkForm } from "./components/copy-link-form";
import { CloseResearch } from "./components/close-research";
import { db } from "iara-shared/database";
import { notFound } from "next/navigation";
import { formatters } from "~/lib/utils";
import { and, count, eq } from "iara-shared/node_modules/drizzle-orm";
import {
  forms,
  type Research,
  researches,
  users,
} from "iara-shared/database/schema";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MoveRightIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";

type Props = {
  params: {
    id: string;
  };
};

/**
 * @todo add a filter to not fetch a research that was deleted
 */
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
    .where(and(eq(researches.id, id), eq(researches.userId, user)))
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

      <section className="space-y-6">
        <p>{research.description}</p>

        <div>
          <p>Criado em: {formatters.date(research.createdAt)}</p>
          <p>Respostas: {research.forms}</p>
        </div>

        {isResearchActive ? (
          <CopyLinkForm research={research.id} status={research.status} />
        ) : null}

        {isResearchFinished ? (
          <div className="text-balance space-y-4">
            <p className="text-sm">
              Sua pesquisa foi precessada, você pode ver os seus resultados
              clicando no botão abaixo:
            </p>
          </div>
        ) : null}
      </section>

      {!isResearchActive ? (
        <div className="w-full flex items-center flex-col gap-2 mt-auto md:flex-row md:justify-between">
          <Button
            size="sm"
            className="gap-2 group w-full md:w-fit"
            variant="outline"
            asChild
          >
            <Link href={`/researchs/${research.id}`}>Voltar</Link>
          </Button>

          <Button size="sm" className="gap-2 group w-full md:w-fit" asChild>
            <Link href={`/researchs/${research.id}/reports`}>
              Ver Relatório{" "}
              <MoveRightIcon className="size-4 group-hover:translate-x-1 transition-all" />
            </Link>
          </Button>
        </div>
      ) : null}

      {isResearchActive ? (
        <CloseResearch research={research.id} status={research.status} />
      ) : null}
    </div>
  );
}
