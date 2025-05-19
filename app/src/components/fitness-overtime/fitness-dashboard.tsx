"use client"
import { useState, useCallback } from "react"
import { EyeClosedIcon } from "@radix-ui/react-icons";
import type { FitnessOvertimeData } from "~/components/fitness-overtime/fitness-overtime-graph"
import type { ReportViewProps } from "~/components/report/report-view"
import type { ReportHeaderProps } from "~/components/report/report-header"
import FitnessOvertimeGraph from "~/components/fitness-overtime/fitness-overtime-graph"
import ReportView from "~/components/report/report-view"
import ReportHeader from "~/components/report/report-header"

interface ReportData extends ReportViewProps, ReportHeaderProps { }

type FitnessDashboardProps = {
    fitnessData: FitnessOvertimeData[]
    reportViewDict: Record<string, ReportData | undefined>
}

export default function FitnessDashboard({ fitnessData, reportViewDict }: FitnessDashboardProps) {
    const [selectedResearchId, setSelectedResearchId] = useState<string | null>(null)

    const handleSelectPurpose = useCallback((researchId: string | null) => {
        setSelectedResearchId(researchId)
    }, [])

    let selectedReportData: ReportData | undefined = undefined
    if (selectedResearchId) {
        const base = reportViewDict[selectedResearchId]
        if (base) {
            selectedReportData = base
        }
    }

    return (
        <div>
            <FitnessOvertimeGraph
                fitnessList={fitnessData}
                onSelectPurpose={handleSelectPurpose}
            />
            {selectedReportData ? (
                <>
                    <ReportHeader
                        formsLength={selectedReportData.formsLength}
                        reports={selectedReportData.reports}
                        research={selectedReportData.research}
                        totalViews={selectedReportData.totalViews}
                    />
                    <ReportView
                        key={`${selectedResearchId ?? ""}`}
                        reports={selectedReportData.reports}
                        research={selectedReportData.research}
                        categories={selectedReportData.categories}
                        enableSwitch={true}
                    />
                </>
            ) : (
                <div
                    className="mt-6 text-center flex flex-col items-center border border-gray-200 dark:border-sky-800 rounded-lg px-4 py-6 bg-[#fafbfc] dark:bg-slate-900 text-gray-500 dark:text-gray-300"
                >
                    Clique no botão do olho fechado
                    <EyeClosedIcon className="w-4 h-4 text-slate-700 dark:text-white" />
                    no gráfico acima para visualizar um relatório.
                </div>
            )}
        </div>
    )
}
