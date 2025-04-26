"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Switch } from "~/components/ui/switch"
import { cn } from "~/lib/utils"

export default function SurveyDashboard() {
  const [expandedPurpose, setExpandedPurpose] = useState<string | null>("exploracao")

  const toggleExpand = (purposeId: string) => {
    setExpandedPurpose(expandedPurpose === purposeId ? null : purposeId)
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Enhanced Tab Component */}
      <Tabs defaultValue="proposito1" className="w-full">
        <div className="border-b mb-6 dark:border-gray-700">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="proposito1"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-sky-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-sky-400 data-[state=active]:rounded-none data-[state=active]:shadow-none rounded-t-lg px-6 py-3 text-base font-medium dark:text-gray-200"
            >
              Propósito 1 (32)
            </TabsTrigger>
            <TabsTrigger
              value="proposito2"
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-sky-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-sky-400 data-[state=active]:rounded-none data-[state=active]:shadow-none rounded-t-lg px-6 py-3 text-base font-medium dark:text-gray-200"
            >
              Propósito 2 (21)
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="proposito1" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {/* Core research question row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-lg md:text-xl font-bold flex-1">
              Qual o principal motivo por ter escolhido nossa Coffee Shop ao invés da concorrência?
            </h1>
            <ScoreBox fit={60} neutral={30} unfit={10} className="min-w-[180px]" />
          </div>

          {/* Section header */}
          <h2 className="text-lg font-bold mb-4 dark:text-white">Propósitos Individuais</h2>

          {/* Purpose blocks */}
          <div className="space-y-4">
            {/* Purpose block A */}
            <PurposeBlock
              id="trabalho"
              title="Trabalho e Estudo"
              analysis={{ type: "improve", label: "Melhorar/Ajustar" }}
              targetAudience={true}
              insight="Foque em aumentar o conforto das cadeiras"
              scores={{ fit: 16, neutral: 77, unfit: 7 }}
              responseCount={15}
              totalCount={32}
              isExpanded={expandedPurpose === "trabalho"}
              onToggleExpand={() => toggleExpand("trabalho")}
            />

            {/* Purpose block B */}
            <PurposeBlock
              id="exploracao"
              title="Exploração"
              analysis={{ type: "abandon", label: "Abandonar" }}
              targetAudience={false}
              insight="Foque na culinária diferenciada"
              scores={{ fit: 7, neutral: 16, unfit: 77 }}
              responseCount={12}
              totalCount={32}
              isExpanded={expandedPurpose === "exploracao"}
              onToggleExpand={() => toggleExpand("exploracao")}
            />
          </div>
        </TabsContent>

        <TabsContent value="proposito2" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-lg md:text-xl font-bold flex-1">
              Qual o principal motivo por ter escolhido nossa Coffee Shop ao invés da concorrência?
            </h1>
            <ScoreBox fit={45} neutral={40} unfit={15} className="min-w-[180px]" />
          </div>

          <div className="bg-gray-50 dark:bg-sky-900 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-300">Conteúdo do Propósito 2 seria exibido aqui.</p>
            <p className="text-gray-400 dark:text-gray-400 text-sm mt-2">Dados ainda em análise.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Score Box Component
function ScoreBox({
  fit,
  neutral,
  unfit,
  className,
}: { fit: number; neutral: number; unfit: number; className?: string }) {
  return (
    <div className={cn("bg-blue-50 dark:bg-sky-900 rounded-lg p-4 flex flex-col justify-center", className)}>
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col items-center">
          <span className="text-green-600 dark:text-green-400 font-bold text-lg">{fit}%</span>
          <span className="text-xs text-gray-600 dark:text-gray-300">Fit</span>
        </div>
        <div className="h-full w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
        <div className="flex flex-col items-center">
          <span className="text-amber-500 dark:text-yellow-400 font-bold text-lg">{neutral}%</span>
          <span className="text-xs text-gray-600 dark:text-gray-300">Neutral</span>
        </div>
        <div className="h-full w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
        <div className="flex flex-col items-center">
          <span className="text-red-500 dark:text-red-400 font-bold text-lg">{unfit}%</span>
          <span className="text-xs text-gray-600 dark:text-gray-300">Unfit</span>
        </div>
      </div>
    </div>
  )
}

// Purpose Block Component
interface PurposeBlockProps {
  id: string
  title: string
  analysis: { type: "maintain" | "improve" | "abandon"; label: string }
  targetAudience: boolean
  insight: string
  scores: { fit: number; neutral: number; unfit: number }
  responseCount: number
  totalCount: number
  isExpanded: boolean
  onToggleExpand: () => void
}

function PurposeBlock({
  id,
  title,
  analysis,
  targetAudience,
  insight,
  scores,
  responseCount,
  totalCount,
  isExpanded,
  onToggleExpand,
}: PurposeBlockProps) {
  const analysisColor = {
    maintain: "text-green-600",
    improve: "text-amber-500",
    abandon: "text-red-500",
  }[analysis.type]

  const [purposeFilter, setPurposeFilter] = useState("todas")

  // Sample responses for each purpose - in a real app, these would be filtered from a larger dataset
  const purposeResponses =
    {
      trabalho: [
        { type: "fit", title: "Ambiente tranquilo", description: "O espaço é perfeito para trabalhar sem distrações." },
        {
          type: "neutral",
          title: "Wi-Fi estável",
          description: "A conexão é boa, mas às vezes fica lenta em horários de pico.",
        },
        {
          type: "unfit",
          title: "Trabalhar fora de casa",
          description: "As cadeiras são muito desconfortáveis para ficar por longos períodos.",
        },
        {
          type: "unfit",
          title: "Trabalhar fora de casa",
          description: "Difícil se concentrar com o barulho e as cadeiras não são ergonômicas.",
        },
      ],
      exploracao: [
        {
          type: "fit",
          title: "Comer um doce diferente",
          description: "O bolo de pistache com limão estava sensacional.",
        },
        {
          type: "fit",
          title: "Comer um doce diferente",
          description: "O bolo de pistache com limão estava sensacional.",
        },
        {
          type: "fit",
          title: "Comer um doce diferente",
          description: "O bolo de pistache com limão estava sensacional.",
        },
        {
          type: "neutral",
          title: "Experimentar um café com especiarias",
          description: "Gostei do sabor, mas achei que poderia ser mais intenso.",
        },
        {
          type: "neutral",
          title: "Experimentar um café com especiarias",
          description: "Interessante, mas não sei se voltaria só por isso.",
        },
      ],
    }[id] || []

  // Filter responses based on selected filter
  const filteredResponses =
    purposeFilter === "todas"
      ? purposeResponses
      : purposeResponses.filter((response) => response.type === purposeFilter)

  return (
    <div className="border rounded-lg p-4 mb-6 dark:border-gray-700 dark:bg-sky-950">
      {/* Header row with title only */}
      <div className="flex items-center mb-3">
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          {/* Public Target switch and Sentiment Analysis side by side */}
          <div className="flex flex-wrap items-center justify-between mb-3 bg-gray-50 dark:bg-sky-900 p-3 rounded-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Análise:</span>
              <span className={cn("text-sm font-medium", analysisColor)}>{analysis.label}</span>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <span className="text-sm font-medium mr-2 dark:text-gray-200">Público Alvo</span>
              <Switch checked={targetAudience} />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-sky-900 p-3 rounded-md mb-4">
            <p className="text-sm dark:text-gray-200">{insight}</p>
          </div>
        </div>

        <div className="md:w-[180px] flex flex-col">
          {/* Score Box */}
          <ScoreBox fit={scores.fit} neutral={scores.neutral} unfit={scores.unfit} className="flex-1" />

          {/* Expansion toggle below Score Box */}
          <button
            onClick={onToggleExpand}
            className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mt-2 py-1 w-full border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-sky-900"
            aria-expanded={isExpanded}
            aria-controls={`${id}-responses`}
          >
            Ver respostas ({responseCount}/{totalCount})
            {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Integrated Response Block - only visible when expanded */}
      {isExpanded && (
        <div id={`${id}-responses`} className="mt-4 border-t pt-4 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Respostas para: {title}</h4>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <FilterPill active={purposeFilter === "todas"} onClick={() => setPurposeFilter("todas")}>
                Todas
              </FilterPill>
              <FilterPill active={purposeFilter === "fit"} onClick={() => setPurposeFilter("fit")}>
                Fit
              </FilterPill>
              <FilterPill active={purposeFilter === "neutral"} onClick={() => setPurposeFilter("neutral")}>
                Neutral
              </FilterPill>
              <FilterPill active={purposeFilter === "unfit"} onClick={() => setPurposeFilter("unfit")}>
                Unfit
              </FilterPill>
            </div>
          </div>

          {/* Response cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResponses.map((response, index) => (
              <ResponseCard
                key={`${id}-response-${index}`}
                type={response.type as "fit" | "neutral" | "unfit"}
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
        active
          ? "bg-gray-200 dark:bg-sky-800 border border-gray-300 dark:border-gray-700 dark:text-white"
          : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sky-900",
      )}
    >
      {children}
    </button>
  )
}

// Response Card Component
function ResponseCard({
  type,
  title,
  description,
}: {
  type: "fit" | "neutral" | "unfit"
  title: string
  description: string
}) {
  const tagColors = {
    fit: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    neutral: "bg-amber-100 dark:bg-yellow-900 text-amber-800 dark:text-yellow-300",
    unfit: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
  }

  return (
    <Card className="bg-blue-50 dark:bg-sky-900">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          {/* Title row with sentiment tag on the right */}
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", tagColors[type])}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
