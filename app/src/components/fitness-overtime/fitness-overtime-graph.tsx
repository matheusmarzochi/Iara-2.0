"use client";
import React, { useState, useMemo } from "react";
import type { ReportData, Research } from "iara-shared/database/schema";

export type FitnessOvertimeData = {
    research: Pick<Research, "id" | "title">;
    report: ReportData[];
};

type FitnessOvertimeGraphProps = {
    fitnessList: FitnessOvertimeData[];
    onSelectPurpose?: (researchId: string | null, proposeId: string | null) => void;
};

export default function FitnessOvertimeGraph({ fitnessList, onSelectPurpose }: FitnessOvertimeGraphProps) {
    const [chartGroup, setChartGroup] = useState<"research" | "purpose">("research");

    const [selectedPurpose, setSelectedPurpose] = useState<{
        researchIdx: number;
        purposeIdx: number;
    } | null>(null);

    function handleSelectPurpose(next: { researchIdx: number; purposeIdx: number } | null) {
        setSelectedPurpose(next);
        if (onSelectPurpose) {
            if (next) {
                const researchId = fitnessList[next.researchIdx]?.research.id ?? null;
                const proposeId = fitnessList[next.researchIdx]?.report[next.purposeIdx]?.question_id ?? null;
                onSelectPurpose(researchId, proposeId);
            } else {
                onSelectPurpose(null, null);
            }
        }
    }


    const allPurposesByIndex = useMemo(() => {
        const maxPurposes = Math.max(...fitnessList.map(f => f.report.length));
        const grouped: { label: string; items: { researchTitle: string; question_id: string; question_propose: string; score_box: any; }[] }[] = [];
        for (let i = 0; i < maxPurposes; i++) {
            const items = fitnessList
                .map(f => f.report[i] && {
                    researchTitle: f.research.title,
                    question_id: f.report[i].question_id,
                    question_propose: f.report[i].question_propose,
                    score_box: f.report[i].score_box,
                })
                .filter(Boolean) as { researchTitle: string; question_id: string; question_propose: string; score_box: any; }[];
            if (items.length > 0) {
                grouped.push({
                    label: items[0].question_propose,
                    items,
                });
            }
        }
        return grouped;
    }, []);

    return (
        <main className="flex flex-col items-center p-8 bg-[#F8FAFC] dark:bg-sky-950 transition-colors">
            <div className="flex w-full max-w-4xl mb-8 gap-8">
                <div className="flex-1">
                    <div className="mb-2 font-semibold flex items-center gap-4 text-foreground dark:text-white">
                        Comparativo dos Relatórios
                        <div className="ml-auto flex gap-2">
                            <button
                                className={`px-3 py-1 rounded border text-sm transition-colors ${chartGroup === "research"
                                        ? "bg-sky-600 text-white border-sky-600"
                                        : "bg-white dark:bg-sky-900 border-gray-300 dark:border-sky-700 text-gray-700 dark:text-white"
                                    }`}
                                onClick={() => setChartGroup("research")}
                            >
                                Por Pesquisa
                            </button>
                            <button
                                className={`px-3 py-1 rounded border text-sm transition-colors ${chartGroup === "purpose"
                                        ? "bg-sky-600 text-white border-sky-600"
                                        : "bg-white dark:bg-sky-900 border-gray-300 dark:border-sky-700 text-gray-700 dark:text-white"
                                    }`}
                                onClick={() => setChartGroup("purpose")}
                            >
                                Por Propósito
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {chartGroup === "research" ? (
                            fitnessList.map((fitness, fIdx) => (
                                <React.Fragment key={fitness.research.id}>
                                    <div className="my-3 mb-3 border-t border-gray-300 dark:border-sky-800 flex items-center">
                                        <span className="px-2 text-xs text-gray-500 dark:text-gray-300 bg-white dark:bg-sky-900 -mt-3">{fitness.research.title}</span>
                                    </div>
                                    {fitness.report.map((r, idx) => {
                                        const total = r.score_box.fit + r.score_box.neutral + r.score_box.unfit || 1;
                                        const fitPct = (r.score_box.fit / total) * 100;
                                        const neutralPct = (r.score_box.neutral / total) * 100;
                                        const unfitPct = (r.score_box.unfit / total) * 100;
                                        const isSelected = selectedPurpose?.researchIdx === fIdx && selectedPurpose?.purposeIdx === idx;
                                        return (
                                            <div key={r.question_id} className="flex items-center gap-2">
                                                <span className="w-24 truncate text-sm text-foreground dark:text-white">{r.question_propose}</span>
                                                <div className="flex-1 h-6 flex rounded overflow-hidden border border-gray-200 dark:border-sky-800 relative">
                                                    <div
                                                        style={{ width: `${fitPct}%` }}
                                                        className="bg-green-400 flex items-center justify-center h-full"
                                                    >
                                                        {fitPct > 10 && (
                                                            <span className="text-xs text-white font-bold px-1">
                                                                {Math.round(fitPct)}% ({r.score_box.fit})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{ width: `${neutralPct}%` }}
                                                        className="bg-amber-400 flex items-center justify-center h-full"
                                                    >
                                                        {neutralPct > 10 && (
                                                            <span className="text-xs text-white font-bold px-1">
                                                                {Math.round(neutralPct)}% ({r.score_box.neutral})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{ width: `${unfitPct}%` }}
                                                        className="bg-red-400 flex items-center justify-center h-full"
                                                    >
                                                        {unfitPct > 10 && (
                                                            <span className="text-xs text-white font-bold px-1">
                                                                {Math.round(unfitPct)}% ({r.score_box.unfit})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="ml-2 text-xs text-foreground dark:text-white">
                                                    {r.score_box.fit}/{r.score_box.neutral}/{r.score_box.unfit}
                                                </span>
                                                <button
                                                    className={`w-28 ml-2 px-2 py-1 rounded text-xs border transition-colors ${isSelected
                                                            ? "bg-sky-600 text-white border-sky-600"
                                                            : "bg-white dark:bg-sky-900 border-gray-300 dark:border-sky-700 text-gray-700 dark:text-white hover:bg-sky-100 dark:hover:bg-sky-800"
                                                        }`}
                                                    onClick={() =>
                                                        handleSelectPurpose(
                                                            isSelected ? null : { researchIdx: fIdx, purposeIdx: idx }
                                                        )
                                                    }
                                                >
                                                    {isSelected ? "Exibindo" : "Ver relatório"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))
                        ) : (
                            allPurposesByIndex.map((group, groupIdx) => (
                                <React.Fragment key={group.label}>
                                    <div className="my-3 mb-1 border-t border-gray-300 dark:border-sky-800 flex items-center">
                                        <span className="px-2 text-xs text-gray-500 dark:text-gray-300 bg-white dark:bg-sky-900 -mt-3">{group.label}</span>
                                    </div>
                                    {group.items.map((p, idx) => {
                                        const total = p.score_box.fit + p.score_box.neutral + p.score_box.unfit || 1;
                                        const fitPct = (p.score_box.fit / total) * 100;
                                        const neutralPct = (p.score_box.neutral / total) * 100;
                                        const unfitPct = (p.score_box.unfit / total) * 100;

                                        const researchIdx = fitnessList.findIndex(f => f.research.title === p.researchTitle);
                                        const purposeIdx = fitnessList[researchIdx]?.report.findIndex(r => r.question_id === p.question_id);
                                        const isSelected = selectedPurpose?.researchIdx === researchIdx && selectedPurpose?.purposeIdx === purposeIdx;
                                        return (
                                            <div key={p.question_id + p.researchTitle} className="flex items-center gap-2">
                                                <span className="w-24 truncate text-sm text-foreground dark:text-white">{p.researchTitle}</span>
                                                <div className="flex-1 h-6 flex rounded overflow-hidden border border-gray-200 dark:border-sky-800 relative">
                                                    <div
                                                        style={{ width: `${fitPct}%` }}
                                                        className="bg-green-400 flex items-center justify-center h-full"
                                                    >
                                                        {fitPct > 10 && (
                                                            <span className="text-xs text-white font-bold px-1">
                                                                {Math.round(fitPct)}% ({p.score_box.fit})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{ width: `${neutralPct}%` }}
                                                        className="bg-amber-400 flex items-center justify-center h-full"
                                                    >
                                                        {neutralPct > 10 && (
                                                            <span className="text-xs text-white font-bold px-1">
                                                                {Math.round(neutralPct)}% ({p.score_box.neutral})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{ width: `${unfitPct}%` }}
                                                        className="bg-red-400 flex items-center justify-center h-full"
                                                    >
                                                        {unfitPct > 10 && (
                                                            <span className="text-xs text-white font-bold px-1">
                                                                {Math.round(unfitPct)}% ({p.score_box.unfit})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="ml-2 text-xs text-foreground dark:text-white">
                                                    {p.score_box.fit}/{p.score_box.neutral}/{p.score_box.unfit}
                                                </span>
                                                <button
                                                    className={`w-28 ml-2 px-2 py-1 rounded text-xs border transition-colors ${isSelected
                                                            ? "bg-sky-600 text-white border-sky-600"
                                                            : "bg-white dark:bg-sky-900 border-gray-300 dark:border-sky-700 text-gray-700 dark:text-white hover:bg-sky-100 dark:hover:bg-sky-800"
                                                        }`}
                                                    onClick={() =>
                                                        handleSelectPurpose(
                                                            isSelected
                                                                ? null
                                                                : { researchIdx, purposeIdx }
                                                        )
                                                    }
                                                >
                                                    {isSelected ? "Exibindo" : "Ver respostas"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

