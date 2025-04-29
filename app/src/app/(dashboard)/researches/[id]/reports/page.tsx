import type React from "react"
import { db } from "iara-shared/database"
import { reports, researches, categories } from "iara-shared/database/schema"
import { eq } from "iara-shared/node_modules/drizzle-orm"
import ReportView from "../components/report-view"
// Adicione as importações necessárias
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { ResearchStatusBadge } from "~/components/researchStatusBadge"

type Props = {
  params: {
    id: string
  }
}

// Server component wrapper
export default async function SurveyDashboard({ params }: Props) {
  const report = await db.query.reports.findFirst({
    where: eq(reports.researchId, params.id),
  })

  const research = await db.query.researches.findFirst({
    where: eq(researches.id, params.id),
    with: {
      questions: {
        with: {
          categories: {
            with: {
              analysis: true
            }
          }
        }
      }
    }
  })

  if (!report || !research) {
    return <div>No report or research found</div>
  }

  const categoryList = research?.questions.flatMap((question) => question.categories)

  // Cabeçalho igual ao ReportsPage
  return (
    <div>
      <header className="space-y-6">
        <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6">
          <Button
            size="sm"
            variant="link"
            className="p-0 text-foreground"
            asChild
          >
            <Link href="/dashboard">
              <span className="sr-only">Voltar para a lista de relatórios</span>
              <ArrowLeftIcon className="size-10" />
            </Link>
          </Button>
          <h2 className="font-semibold text-3xl">{research.title}</h2>
          <ResearchStatusBadge status={research.status} />
        </div>
        <h3 className="text-lg font-bold">Resultados</h3>
      </header>
      <ReportView reports={report.data} research={research} categories={categoryList} enableSwitch={true} />
    </div>
  )
}
