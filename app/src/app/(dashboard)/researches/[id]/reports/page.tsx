import type React from "react"
import { db } from "iara-shared/database"
import { reports, researches, researchViews } from "iara-shared/database/schema"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"
import ReportView from "../components/report-view"
// Adicione as importações necessárias
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { ArrowLeftIcon, EyeIcon, ClipboardListIcon, UserCheck,  } from "lucide-react"
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
      },
      forms: {
        columns: { id: true }
      }
    }
  })


  const uniqueViews = await db
    .select({
      uniqueViews: countDistinct(researchViews.sessionId),
    })
    .from(researchViews)
    .where(eq(researchViews.researchId, params.id));

  const reportTotalUniqueViews = uniqueViews[0]?.uniqueViews || 0;


  if (!report || !research) {
    return <div>No report or research found</div>
  }

  const categoryList = research?.questions.flatMap((question) => question.categories)

  // Cabeçalho igual ao ReportsPage
  return (
    <div>
      <header className="space-y-6">
        <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6 justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="link"
              className="p-0 text-foreground"
              asChild
            >
              <Link href="/dashboard?status=FINISHED">
                <span className="sr-only">Voltar para a lista de relatórios</span>
                <ArrowLeftIcon className="size-10" />
              </Link>
            </Button>
            <h2 className="font-semibold text-3xl">{research.title}</h2>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between lg:gap-6">
          <h3 className="text-lg font-bold ml-4">Resultados</h3>
          <div className="flex flex-row items-center gap-2 lg:gap-4 w-full justify-end">
            <span className="flex items-center gap-3 text-muted-foreground text-sm">
              <span
                className="flex items-center gap-1"
                title="Número de visualizações únicas desta pesquisa"
              >
                <EyeIcon className="size-4" />
                {reportTotalUniqueViews}
              </span>
              <span
                className="flex items-center gap-1"
                title="Número de respostas recebidas"
              >
                <ClipboardListIcon className="size-4" />
                {research.forms.length}
              </span>
              <span
                className="flex items-center gap-1"
                title="Porcentagem de Conversão"
              >
                <UserCheck className="size-4" />
                {`(${
                  research.forms.length > reportTotalUniqueViews
                    ? 100
                    : Math.round(Math.min(100, research.forms.length  * 100 / reportTotalUniqueViews))
                }%)`}
              </span>
            </span>
            <ResearchStatusBadge status={research.status} />
          </div>
        </div>
      </header>
      <ReportView reports={report.data} research={research} categories={categoryList} enableSwitch={true} />
    </div>
  )
}
