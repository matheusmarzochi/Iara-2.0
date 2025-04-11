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
import { ArrowLeftIcon, MoveRightIcon, PencilIcon, Search } from "lucide-react";
import { ResearchStatusBadge } from "~/components/researchStatusBadge";
import download from "iara-shared/storage/download";
import { Card } from "~/components/ui/card";
import { downloadAction } from "./action";

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
        .where(isNull(researches.deletedAt))
        .limit(1)
        .groupBy(researches.id);

    return research;
}

export default async function ResearchPage({ params }: Props) {
    const research = await getResearchById(params.id);

    if (!research) {
        return notFound();
    }

    const isResearchInAnalysis = research.status === "ANALYSIS";
    const isResearchActive = research.status === "CREATED" || research.status === "OPENED";
    const isResearchFinished = research.status === "FINISHED";

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
                            <Link href="/admin">
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
                                <p className="text-sm text-muted-foreground">Respostas:</p>
                                {isResearchInAnalysis ? (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex size-4">
                                            <Search className="absolute inline-flex size-4 animate-ping opacity-75" />
                                            <Search className="relative inline-flex size-4" />
                                        </span>
                                        <p className="font-medium">Em Análise</p>
                                    </div>
                                ) : (
                                    <p className="font-medium">{research.forms}</p>
                                )}
                            </div>
                        </div>
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

                    {isResearchInAnalysis && (
                        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                            A pesquisa está em análise. Este processo pode levar um tempo para concluir.
                            Enquanto isso, apenas a opção de exclusão está disponível.
                        </div>
                    )}
                    {/* Card para download do arquivo */}
                    <Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
                        <h4 className="font-medium">Download do Arquivo</h4>
                        <p className="text-sm text-muted-foreground dark:text-white">
                            Clique no botão abaixo para baixar o arquivo relacionado à pesquisa.
                        </p>
                        <Button asChild className="w-full">
                            <a href={`/admin/${research.id}/download`} target="_blank" rel="noopener noreferrer">
                                Baixar Arquivo
                            </a>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
