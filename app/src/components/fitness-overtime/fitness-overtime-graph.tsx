"use client";
import React, { useState, useMemo } from "react";
import type { ReportData, Research } from "iara-shared/database/schema";
import { Eye } from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";

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
            ? new Date(`${dateStr}T00:00:00Z`)
            : new Date(dateStr);
    } else {
        d = dateStr;
    }
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

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

    const barData = sortedFitnessList.map((fitness) => {
        const totalScore = sumScoreBox(fitness.report);
        const total = totalScore.fit + totalScore.neutral + totalScore.unfit || 1;
        return {
            fit: totalScore.fit,
            neutral: totalScore.neutral,
            unfit: totalScore.unfit,
            fitPct: (totalScore.fit / total) * 100,
            neutralPct: (totalScore.neutral / total) * 100,
            unfitPct: (totalScore.unfit / total) * 100,
            createdAt: fitness.research.createdAt,
        };
    });

    const barWidth = 28; // px
    const barGap = 6; // px

    return (
        <div className="flex flex-col items-center transition-colors">
            <div className="w-full mb-8">
                <div className="flex-1">
                    <div className="mb-2 font-semibold flex items-center gap-4 text-foreground dark:text-white">
                        Comparativo dos Relatórios
                    </div>
                    <div className="w-full flex flex-col items-stretch">
                        <div className="w-full overflow-x-auto">
                            <div
                                className="flex items-end justify-start"
                                style={{
                                    minHeight: 340,
                                    paddingBottom: 8,
                                    minWidth: `${barData.length * (barWidth + barGap)}px`,
                                }}
                            >
                                {barData.map((bar, fIdx) => {
                                    const isSelected = selectedPurpose?.researchIdx === fIdx;
                                    return (
                                        <div
                                            key={fIdx}
                                            className="flex flex-col items-center justify-end"
                                            style={{
                                                width: `${barWidth}px`,
                                                marginRight: fIdx !== barData.length - 1 ? `${barGap}px` : undefined,
                                            }}
                                        >
                                            <span
                                                className="mb-2 text-xs text-foreground dark:text-white break-words"
                                                style={{
                                                    writingMode: "vertical-rl",
                                                    transform: "rotate(180deg)",
                                                    whiteSpace: "nowrap",
                                                    height: "80px",
                                                    overflow: "hidden",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: `${barWidth}px`,
                                                }}
                                            >
                                                {formatDate(bar.createdAt)}
                                            </span>
                                            <div
                                                className="flex flex-col-reverse rounded overflow-hidden border border-gray-200 dark:border-sky-800 relative transition-all duration-200 cursor-pointer"
                                                style={{
                                                    width: `${barWidth}px`,
                                                    height: "288px",
                                                    boxShadow: isSelected ? "0 0 0 2px #0284c7" : undefined,
                                                    borderColor: isSelected ? "#0284c7" : undefined,
                                                    boxSizing: "border-box",
                                                }}
                                                onClick={() =>
                                                    handleSelectPurpose(
                                                        isSelected ? null : { researchIdx: fIdx, purposeIdx: 0 }
                                                    )
                                                }
                                                title={isSelected ? "Ocultar relatório" : "Ver relatório"}
                                            >
                                                {/* Unfit */}
                                                <div
                                                    style={{ height: `${bar.unfitPct}%` }}
                                                    className="bg-red-400 flex items-end justify-center w-full transition-all duration-200"
                                                />
                                                {/* Neutral */}
                                                <div
                                                    style={{ height: `${bar.neutralPct}%` }}
                                                    className="bg-amber-400 flex items-end justify-center w-full transition-all duration-200"
                                                />
                                                {/* Fit */}
                                                <div
                                                    style={{ height: `${bar.fitPct}%` }}
                                                    className="bg-green-400 flex items-end justify-center w-full transition-all duration-200"
                                                />
                                            </div>
                                            <button
                                                className={`mt-2 w-7 h-7 flex items-center justify-center rounded text-xs border transition-colors z-10 bg-white/80 dark:bg-sky-900/80
                                                    ${isSelected
                                                        ? "bg-sky-600 text-white border-sky-600"
                                                        : "border-gray-300 dark:border-sky-700 text-gray-700 dark:text-white hover:bg-sky-100 dark:hover:bg-sky-800"
                                                    }`}
                                                onClick={() =>
                                                    handleSelectPurpose(
                                                        isSelected ? null : { researchIdx: fIdx, purposeIdx: 0 }
                                                    )
                                                }
                                                type="button"
                                                title={isSelected ? "Ocultar relatório" : "Ver relatório"}
                                                style={{ boxShadow: "0 1px 4px 0 #0001" }}
                                            >
                                                {isSelected ? (
                                                    <Eye className="w-4 h-4 text-slate-700 dark:text-white" />
                                                ) : (
                                                    <EyeClosedIcon className="w-4 h-4 text-slate-700 dark:text-white" />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

