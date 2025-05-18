"use client"
import { useState, useCallback } from "react"
import type { FitnessOvertimeData } from "~/components/fitness-overtime/fitness-overtime-graph"
import type { ReportViewProps } from "~/components/report/report-view"
import type { ReportHeaderProps } from "~/components/report/report-header"
import FitnessOvertimeGraph from "~/components/fitness-overtime/fitness-overtime-graph"
import ReportView from "~/components/report/report-view"
import ReportHeader from "~/components/report/report-header"

interface ReportData extends ReportViewProps, ReportHeaderProps { }

type FitnessDashboardClientProps = {
    fitnessData: FitnessOvertimeData[]
    reportViewDict: Record<string, ReportData | undefined>
}

export default function FitnessDashboardClient({ fitnessData, reportViewDict }: FitnessDashboardClientProps) {
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
            {selectedReportData && (
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
            )}
        </div>
    )
}
