"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~/components/ui/button"
import type { ReportData, Research } from 'iara-shared/database/schema'
import { ArrowLeftIcon } from "lucide-react"
import { ResearchStatusBadge } from "~/components/research/researchStatusBadge"
import ResearchInteractionsCount from "~/components/research/researchInteractionsCount"
import ScoreBoxView from "./score-box-view"

export interface ReportHeaderProps {
    research: Omit<Research, "forms" | "questions">
    reports: ReportData[],
    formsLength: number,
    totalViews: number,
}

export default function ReportHeader({ research, formsLength, reports, totalViews }: ReportHeaderProps) {
    const pathname = usePathname();
    const showBackButton = !pathname.startsWith("/fitness")
    const backHref = pathname.startsWith("/admin")
        ? "/admin/researches"
        : "/dashboard?status=FINISHED";

    const totalScores = reports.reduce(
        (acc, report) => ({
            fit: acc.fit + (report.score_box?.fit ?? 0),
            neutral: acc.neutral + (report.score_box?.neutral ?? 0),
            unfit: acc.unfit + (report.score_box?.unfit ?? 0),
            count: acc.count + report.point_of_interests.reduce((sum, poi) => sum + poi.answers.length, 0),
        }),
        { fit: 0, neutral: 0, unfit: 0, count: 0 }
    )

    return (
        <header className="space-y-6">
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-6 justify-between">
                <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-2 relative">
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
                    {totalScores.count > 0 && (
                        <ScoreBoxView
                            fit={Math.round(100 * totalScores.fit / totalScores.count)}
                            neutral={Math.round(100 * totalScores.neutral / totalScores.count)}
                            unfit={Math.round(100 * totalScores.unfit / totalScores.count)}
                            className="w-full md:w-[200px] mt-2 md:mt-0 md:ml-auto"
                        />
                    )}
                </div>
            </div>
        </header>
    );
};
