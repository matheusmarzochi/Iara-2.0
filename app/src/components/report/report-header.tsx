"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~/components/ui/button"
import type { Research } from 'iara-shared/database/schema'
import { ArrowLeftIcon } from "lucide-react"
import { ResearchStatusBadge } from "~/components/research/researchStatusBadge"
import ResearchInteractionsCount from "~/components/research/researchInteractionsCount"

export interface ReportHeaderProps {
    research: Omit<Research, "forms" | "questions">
    formsLength: number,
    totalViews: number,
}

export default function ReportHeader({ research, formsLength, totalViews }: ReportHeaderProps) {
    const pathname = usePathname();
    const showBackButton = !pathname.startsWith("/fitness")
    const backHref = pathname.startsWith("/admin")
        ? "/admin/researches"
        : "/dashboard?status=FINISHED";

    return (
        <header className="space-y-6">
            <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6 justify-between">
                <div className="flex items-center gap-2">
                    {showBackButton && (
                        <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-foreground"
                            asChild
                        >
                            <Link href={backHref}>
                                <span className="sr-only">Voltar para a lista de relatórios</span>
                                <ArrowLeftIcon className="size-10" />
                            </Link>
                        </Button>
                    )}
                    <h2 className="font-semibold text-3xl">{research.title}</h2>
                </div>
            </div>
            <div className="flex flex-row items-center justify-between lg:gap-6">
                <h3 className="text-lg font-bold ml-4">Resultados</h3>
                <div className="flex flex-row items-center gap-2 lg:gap-4 w-full justify-end">
                    <ResearchInteractionsCount formsLength={formsLength} totalViews={totalViews} />
                    <ResearchStatusBadge status={research.status} />
                </div>
            </div>
        </header>
    );
};
