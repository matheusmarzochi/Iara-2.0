"use client";
import React, { useState, useMemo } from "react";
import type { ReportData, Research } from "iara-shared/database/schema";
import { Eye, EyeOff } from "lucide-react";

export type FitnessOvertimeData = {
    research: Pick<Research, "id" | "title" | "createdAt">;
    report: ReportData[];
};

type FitnessOvertimeGraphProps = {
    fitnessList: FitnessOvertimeData[];
    onSelectPurpose?: (researchId: string | null, proposeId: string | null) => void;
};

function formatDate(dateStr?: string | Date) {
    if (!dateStr) return "";
    let d: Date;
    if (typeof dateStr === "string") {
        d = dateStr.length <= 10
            ? new Date(dateStr + "T00:00:00Z")
            : new Date(dateStr);
    } else {
        d = dateStr;
    }
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// Função utilitária para somar score_box de um array de relatórios
function sumScoreBox(reports: { score_box: { fit: number; neutral: number; unfit: number } }[]) {
    return reports.reduce(
        (acc, r) => ({
            fit: acc.fit + (r.score_box.fit || 0),
            neutral: acc.neutral + (r.score_box.neutral || 0),
            unfit: acc.unfit + (r.score_box.unfit || 0),
        }),
        { fit: 0, neutral: 0, unfit: 0 }
    );
}

export default function FitnessOvertimeGraph({ fitnessList, onSelectPurpose }: FitnessOvertimeGraphProps) {
    const sortedFitnessList = useMemo(() => {
        return [...fitnessList].sort((a, b) => {
            const dateA = new Date(a.research.createdAt).getTime();
            const dateB = new Date(b.research.createdAt).getTime();
            return dateA - dateB;
        });
    }, [fitnessList]);

    const [selectedPurpose, setSelectedPurpose] = useState<{
        researchIdx: number;
        purposeIdx: number;
    } | null>(null);

    function handleSelectPurpose(next: { researchIdx: number; purposeIdx: number } | null) {
        setSelectedPurpose(next);
        if (onSelectPurpose) {
            if (next) {
                const researchId = sortedFitnessList[next.researchIdx]?.research.id ?? null;
                const proposeId = sortedFitnessList[next.researchIdx]?.report[next.purposeIdx]?.question_id ?? null;
                onSelectPurpose(researchId, proposeId);
            } else {
                onSelectPurpose(null, null);
            }
        }
    }

    return (
        <main className="flex flex-col items-center p-8 bg-[#F8FAFC] dark:bg-sky-950 transition-colors">
            <div className="flex w-full max-w-4xl mb-8 gap-8">
                <div className="flex-1">
                    <div className="mb-2 font-semibold flex items-center gap-4 text-foreground dark:text-white">
                        Comparativo dos Relatórios
                    </div>
                    <div className="space-y-2">
                        {sortedFitnessList.map((fitness, fIdx) => {
                            // Soma todos os score_box dos relatórios deste research
                            const totalScore = sumScoreBox(fitness.report);
                            const total = totalScore.fit + totalScore.neutral + totalScore.unfit || 1;
                            const fitPct = (totalScore.fit / total) * 100;
                            const neutralPct = (totalScore.neutral / total) * 100;
                            const unfitPct = (totalScore.unfit / total) * 100;
                            const isSelected = selectedPurpose?.researchIdx === fIdx;
                            return (
                                <React.Fragment key={fitness.research.id}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="min-w-[8rem] max-w-xs text-sm text-foreground dark:text-white whitespace-normal"
                                            style={{ wordBreak: "break-word" }}
                                        >
                                            {formatDate(fitness.research.createdAt)}
                                        </span>
                                        <div className="flex-1 h-6 flex rounded overflow-hidden border border-gray-200 dark:border-sky-800 relative">
                                            <div
                                                style={{ width: `${fitPct}%` }}
                                                className="bg-green-400 flex items-center justify-center h-full"
                                            >
                                                {fitPct > 10 && (
                                                    <span className="text-xs text-white font-bold px-1">
                                                        {Math.round(fitPct)}% ({totalScore.fit})
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                style={{ width: `${neutralPct}%` }}
                                                className="bg-amber-400 flex items-center justify-center h-full"
                                            >
                                                {neutralPct > 10 && (
                                                    <span className="text-xs text-white font-bold px-1">
                                                        {Math.round(neutralPct)}% ({totalScore.neutral})
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                style={{ width: `${unfitPct}%` }}
                                                className="bg-red-400 flex items-center justify-center h-full"
                                            >
                                                {unfitPct > 10 && (
                                                    <span className="text-xs text-white font-bold px-1">
                                                        {Math.round(unfitPct)}% ({totalScore.unfit})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className={`w-8 h-8 ml-2 flex items-center justify-center rounded text-xs border transition-colors ${isSelected
                                                    ? "bg-sky-600 text-white border-sky-600"
                                                    : "bg-white dark:bg-sky-900 border-gray-300 dark:border-sky-700 text-gray-700 dark:text-white hover:bg-sky-100 dark:hover:bg-sky-800"
                                                }`}
                                            onClick={() =>
                                                handleSelectPurpose(
                                                    isSelected ? null : { researchIdx: fIdx, purposeIdx: 0 }
                                                )
                                            }
                                            title={isSelected ? "Ocultar relatório" : "Ver relatório"}
                                        >
                                            {isSelected ? (
                                                // Ícone de olho fechado (hide) do lucide-react
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                // Ícone de olho aberto (show) do lucide-react
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}

