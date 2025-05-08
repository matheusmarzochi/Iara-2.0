import { db } from "iara-shared/database";
import { notFound } from "next/navigation";
import { formatters, relativeTime } from "~/lib/utils";
import { count, eq, countDistinct } from "iara-shared/node_modules/drizzle-orm";
import {
    forms,
    researches,
    users,
    researchViews
} from "iara-shared/database/schema";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, Search, Trash2 } from "lucide-react";
import { ResearchStatusBadge } from "~/components/research/researchStatusBadge";
import { Card } from "~/components/ui/card";
import ResearchInteractionsCount from "~/components/research/researchInteractionsCount";
import { processResearch } from "./action";

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
            uploadPath: researches.uploadPath,
            deletedAt: researches.deletedAt,
        })
        .from(researches)
        .leftJoin(forms, eq(forms.researchId, researches.id))
        .where(eq(researches.id, id))
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

    const isOpened = research.status === "OPENED";
    const inAnalysis = research.status === "ANALYSIS";
    const inProcessing = research.status === "PROCESSING";
    const asUpload = research.uploadPath !== null

    return (
        <div className="flex flex-col h-[calc(100dvh-160px)] container">
            <header className="pt-4 pb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6">
                        <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-foreground inline-flex"
                            asChild
                        >
                            <Link href="/admin/researches">
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
                        {research.deletedAt ? (
                            <span className="mb-2 text-red-500" title={`Deleted at ${new Date(research.deletedAt).toLocaleString()}`}>
                                <Trash2 className="w-4 h-4 inline-block" />
                            </span>
                        ) : (
                            <span className="mb-2 inline-block w-4 h-4" />
                        )}
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
                                {inAnalysis ? (
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
                        {research.deletedAt && (
                            <div className="p-4 rounded-lg border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                                <p className="text-sm text-muted-foreground">Deletado em:</p>
                                <p className="font-medium text-red-600 dark:text-red-300">
                                    {formatters.date(research.deletedAt)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    (Há {relativeTime(research.deletedAt)})
                                </p>
                            </div>
                        )}
                    </section>
                    {/* Atualizar dados da pesquisa (Quetões e formularios) */}
                    <section className="space-y-4 mt-6">
                        <h3 className="text-xl font-medium">
                            Atualizar dados da pesquisa (Quetões e formularios)
                        </h3>
                        <textarea
                            className="w-full h-40 p-2 border rounded"
                            placeholder="Insira os dados aqui..."
                        />
                        <Button>Submeter</Button>
                    </section>
                </div>

                {/* Action Cards */}
                <div className="space-y-4">
                    <h3 className="text-xl font-medium">Ações</h3>

                    {(inAnalysis || isOpened) && (
                        <div className="mb-4 p-4 border rounded">
                        <h4 className="font-medium">Processar Pesquisa</h4>
                        <p className="text-sm text-muted-foreground">
                            Clique abaixo para enviar a pesquisa para processamento.
                        </p>
                        <form action={processResearch}>
                            <input type="hidden" name="researchId" value={research.id} />
                            <Button type="submit" variant="outline" className="w-full">
                                Enviar para Processamento
                            </Button>
                        </form>
                    </div>
                    )}

                    {isOpened && (
                        <div className="mb-4 p-4 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900 rounded">
                            A pesquisa está aberta. Aguardando uma ação do usuário.
                        </div>
                    )}

                    {/* Card para download do arquivo */}
                    {asUpload && (
                        <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                            <h4 className="font-medium">Download do Arquivo</h4>
                            <p className="text-sm text-muted-foreground dark:text-white">
                                Clique no botão abaixo para baixar o arquivo relacionado à pesquisa.
                            </p>
                            <Button asChild className="w-full">
                                <a href={`/admin/researches/${research.id}/download`} target="_blank" rel="noopener noreferrer">
                                    Baixar Arquivo
                                </a>
                            </Button>
                        </Card>
                    )}
                    {research.status === "FINISHED" && (
                        <Card className="p-4 space-y-3 border rounded">
                            <h4 className="font-medium">Relatório</h4>
                            <p className="text-sm text-muted-foreground">
                                Clique abaixo para acessar o relatório final da pesquisa.
                            </p>
                            <Button asChild className="w-full">
                                <a href={`/admin/researches/${research.id}/reports`}>
                                    Acessar Relatório
                                </a>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
