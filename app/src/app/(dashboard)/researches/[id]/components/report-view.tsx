"use client"

import type React from "react"
import { useState, useMemo, useTransition } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Switch } from "~/components/ui/switch"
import { cn } from "~/lib/utils"
import { Category, ReportData, Research, ScoreBox } from "iara-shared/database/schema"
import { updateCategoryTarget } from "./update-category-target-action"

type Props = {
    reports: ReportData[];
    research: Omit<Research, "forms" | "questions">;
    categories: Category[];
}

export interface Response {
    type: "fit" | "neutral" | "unfit"
    title: string
    description: string
}

export interface PurposeData {
    id: string
    title: string
    analysis: {
        on_target: {
            criteria: string;
            action: string;
        },
        off_target: {
            criteria: string;
            action: string;
        },
    },
    targetAudience: boolean
    insight: string
    scores: ScoreBox
    responseCount: number
    totalCount: number
    responses: Response[]
}

export interface TabData {
    id: string
    title: string
    count: number
    question: string
    overallScores: ScoreBox
    purposes: PurposeData[]
}


// Helper to map report data to TabData
function mapReportsToTabs(reports: ReportData[]): TabData[] {
    return reports.map((report, idx) => ({
        id: report.question_id,
        title: `Propósito ${idx + 1}`,
        count: report.point_of_interests.reduce((acc, poi) => acc + poi.answers.length, 0),
        question: report.question_propose,
        overallScores: report.score_box,
        purposes: report.point_of_interests.map((poi) => ({
            id: poi.name,
            title: poi.name,
            analysis: poi.analysis,
            targetAudience: true, // Placeholder, adjust as needed
            insight: (report.strategy_insights.improve && report.strategy_insights.improve[0]) || "",
            scores: poi.score_box,
            responseCount: poi.answers.length,
            totalCount: report.total_forms,
            responses: poi.answers.map((ans) => ({
                type: ans.score >= 4 ? "fit" : ans.score <= 1 ? "unfit" : "neutral",
                title: ans.purpose,
                description: ans.explanation,
            })),
        })),
    }))
}

export default function ReportView({ reports, research, categories }: Props) {
    const tabData = useMemo(() => mapReportsToTabs(reports), [reports])
    const [expandedPurpose, setExpandedPurpose] = useState<string | null>(null)

    const toggleExpand = (purposeId: string) => {
        setExpandedPurpose(expandedPurpose === purposeId ? null : purposeId)
    }

    if (!tabData.length) {
        return (
            <div className="container mx-auto py-6 px-4 max-w-6xl">
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Nenhum relatório disponível.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <Tabs defaultValue={tabData[0].id} className="w-full">
                <div className="border-b mb-6">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                        {tabData.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="data-[state=active]:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:rounded-none data-[state=active]:shadow-none rounded-t-lg px-6 py-3 text-base font-medium"
                            >
                                {tab.title} ({tab.count})
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {tabData.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <h1 className="text-lg md:text-xl font-bold flex-1">{tab.question}</h1>
                            <ScoreBoxView
                                fit={Math.round(100 * tab.overallScores.fit / tab.count )}
                                neutral={Math.round(100 * tab.overallScores.neutral / tab.count)}
                                unfit={Math.round(100 * tab.overallScores.unfit / tab.count)}
                                className="min-w-[180px]"
                            />
                        </div>

                        {tab.purposes.length > 0 ? (
                            <>
                                <h2 className="text-lg font-bold mb-4">Propósitos Individuais</h2>
                                <div className="space-y-4">
                                    {tab.purposes.map((purpose) => (
                                        <PurposeBlock
                                            key={purpose.id}
                                            purpose={purpose}
                                            categories={categories}
                                            isExpanded={expandedPurpose === purpose.id}
                                            onToggleExpand={() => toggleExpand(purpose.id)}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <p className="text-gray-500">Conteúdo do {tab.title} seria exibido aqui.</p>
                                <p className="text-gray-400 text-sm mt-2">Dados ainda em análise.</p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

// Score Box Component
function ScoreBoxView({ fit, neutral, unfit, className }: ScoreBox & { className?: string }) {
    return (
        <div className={cn("bg-blue-50 rounded-lg p-4 flex flex-col justify-center", className)}>
            <div className="flex items-center justify-between h-full">
                <div className="flex flex-col items-center">
                    <span className="text-green-600 font-bold text-lg">{fit}%</span>
                    <span className="text-xs text-gray-600">Fit</span>
                </div>
                <div className="h-full w-px bg-gray-300 mx-2"></div>
                <div className="flex flex-col items-center">
                    <span className="text-amber-500 font-bold text-lg">{neutral}%</span>
                    <span className="text-xs text-gray-600">Neutral</span>
                </div>
                <div className="h-full w-px bg-gray-300 mx-2"></div>
                <div className="flex flex-col items-center">
                    <span className="text-red-500 font-bold text-lg">{unfit}%</span>
                    <span className="text-xs text-gray-600">Unfit</span>
                </div>
            </div>
        </div>
    )
}

// Purpose Block Component
interface PurposeBlockProps {
    purpose: PurposeData
    isExpanded: boolean
    categories: Category[]
    onToggleExpand: () => void
}

function PurposeBlock({ purpose, isExpanded, categories, onToggleExpand }: PurposeBlockProps) {
    const category = categories.find((c) => (c.name == purpose.title ))
    const [showOnTarget, setShowOnTarget] = useState(category?.target)
    const [purposeFilter, setPurposeFilter] = useState("todas")
    const [isPending, startTransition] = useTransition()

    // Função para atualizar o target da categoria
    const handleTargetChange = (checked: boolean) => {
        if (!category) return
        setShowOnTarget(checked)
        startTransition(async () => {
            await updateCategoryTarget(category.id, checked)
            // Opcional: você pode adicionar lógica para feedback ao usuário aqui
        })
    }

    const analysis = showOnTarget ? purpose.analysis.on_target : purpose.analysis.off_target
    
    const criteriaColor = {
        MAINTAIN: "text-green-600",
        IMPROVE: "text-amber-500",
        ABANDON: "text-red-500",
        PIVOT: "text-blue-600",
        FOCUS: "text-purple-600",
        RETHINK: "text-gray-600",
    }[analysis.criteria] || "text-gray-600"

    const criteriaTranslation: Record<string, string> = {
        MAINTAIN: "Manter",
        IMPROVE: "Melhorar",
        ABANDON: "Abandonar",
        PIVOT: "Pivotar",
        FOCUS: "Focar",
        RETHINK: "Repensar",
    }

    const filteredResponses =
        purposeFilter === "todas"
            ? purpose.responses
            : purpose.responses.filter((response) => response.type === purposeFilter)

    return (
        <div className="border rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
                <h3 className="text-lg font-semibold">{purpose.title}</h3>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between mb-3">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Análise:</span>
                            <span className={cn("text-sm font-medium uppercase", criteriaColor)}>
                                {criteriaTranslation[analysis.criteria] || analysis.criteria}
                            </span>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <span className="text-sm font-medium mr-2">
                                Público Alvo
                            </span>
                            <Switch checked={showOnTarget} onCheckedChange={handleTargetChange} disabled={isPending} />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                        <p className="text-sm">{analysis.action}</p>
                    </div>
                </div>

                <div className="md:w-[180px] flex flex-col">
                    {/* Score Box */}
                    <ScoreBoxView
                        fit={Math.round(100 * purpose.scores.fit / purpose.responseCount)}
                        neutral={Math.round(100 * purpose.scores.neutral / purpose.responseCount)}
                        unfit={Math.round(100 * purpose.scores.unfit / purpose.responseCount)}
                        className="flex-1"
                    />

                    {/* Expansion toggle below Score Box */}
                    <button
                        onClick={onToggleExpand}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 mt-2 py-1 w-full border border-gray-200 rounded-md"
                        aria-expanded={isExpanded}
                        aria-controls={`${purpose.id}-responses`}
                    >
                        Ver respostas ({purpose.responseCount}/{purpose.totalCount})
                        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Integrated Response Block - only visible when expanded */}
            {isExpanded && (
                <div id={`${purpose.id}-responses`} className="mt-4 border-t pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h4 className="font-medium text-gray-900">Respostas:</h4>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                            <FilterPill active={purposeFilter === "todas"} onClick={() => setPurposeFilter("todas")}>
                                Todas ({purpose.responseCount})
                            </FilterPill>
                            <FilterPill active={purposeFilter === "fit"} onClick={() => setPurposeFilter("fit")}>
                                Fit ({purpose.scores.fit})
                            </FilterPill>
                            <FilterPill active={purposeFilter === "neutral"} onClick={() => setPurposeFilter("neutral")}>
                                Neutral ({purpose.scores.neutral})
                            </FilterPill>
                            <FilterPill active={purposeFilter === "unfit"} onClick={() => setPurposeFilter("unfit")}>
                                Unfit ({purpose.scores.unfit})
                            </FilterPill>
                        </div>
                    </div>

                    {/* Response cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResponses.map((response, index) => (
                            <ResponseCard
                                key={`${purpose.id}-response-${index}`}
                                type={response.type}
                                title={response.title}
                                description={response.description}
                            />
                        ))}

                        {filteredResponses.length === 0 && (
                            <div className="col-span-3 py-8 text-center text-gray-500">
                                Nenhuma resposta encontrada com este filtro.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// Filter Pill Component
function FilterPill({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 rounded-full text-sm",
                active ? "bg-gray-200 border border-gray-300" : "text-gray-500 hover:bg-gray-100",
            )}
        >
            {children}
        </button>
    )
}

// Response Card Component
function ResponseCard({ type, title, description }: Response) {
    const tagColors = {
        fit: "bg-green-100 text-green-800",
        neutral: "bg-amber-100 text-amber-800",
        unfit: "bg-red-100 text-red-800",
    }

    return (
        <Card className="bg-blue-50">
            <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                    {/* Title row with sentiment tag on the right */}
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900">{title}</h4>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", tagColors[type])}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
