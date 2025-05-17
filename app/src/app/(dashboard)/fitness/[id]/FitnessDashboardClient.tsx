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
    const [selected, setSelected] = useState<{ researchId: string | null, proposeId: string | null }>({ researchId: null, proposeId: null })

    const handleSelectPurpose = useCallback((researchId: string | null, proposeId: string | null) => {
        if (researchId && reportViewDict[researchId]) {
            const base = reportViewDict[researchId]
            const firstReport = base?.reports?.[0]
            setSelected({
                researchId,
                proposeId: proposeId ?? firstReport?.question_id ?? null
            })
        } else {
            setSelected({ researchId, proposeId })
        }
    }, [reportViewDict])

    let selectedReportData: ReportData | undefined = undefined
    if (selected.researchId && selected.proposeId) {
        const base = reportViewDict[selected.researchId]
        if (base) {
            const filteredReports = base.reports.filter(r => r.question_id === selected.proposeId)
            if (filteredReports.length > 0) {
                selectedReportData = {
                    ...base,
                    reports: filteredReports,
                }
            }
        }
    }

    const handleTabSelect = useCallback((tabId: string) => {
        if (selected.researchId) {
            setSelected({ researchId: selected.researchId, proposeId: tabId })
        }
    }, [selected.researchId])

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
                        research={selectedReportData.research}
                        totalViews={selectedReportData.totalViews}
                    />
                    <ReportView
                        key={`${selected.researchId ?? ""}-${selected.proposeId ?? ""}`}
                        reports={selectedReportData.reports}
                        research={selectedReportData.research}
                        categories={selectedReportData.categories}
                        enableSwitch={true}
                        defaultTabId={selected.proposeId || undefined}
                        onTabSelect={handleTabSelect}
                    />
                </>
            )}
        </div>
    )
}
