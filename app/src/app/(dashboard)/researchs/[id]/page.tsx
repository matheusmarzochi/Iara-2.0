import { CopyLinkForm } from "./components/copy-link-form";
import { CloseResearch } from "./components/close-research";
import { db } from "~/database";
import { notFound } from "next/navigation";
import { formatters } from "~/lib/utils";
import { and, count, eq, inArray } from "drizzle-orm";
import { answers, forms, Research, researches, users, Answer, categories } from "~/database/schema";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: {
    id: string;
  };
};


type ScoreBox = {
  fit: number
  neutral: number
  unfit: number
}
type PointOfInterest = {
  name: string
  score_box: ScoreBox
  answers: Answer[]
}

type StrategyInsights = {
  improve: string[]
  adjust: string[]
  develop: string[]
  focus: string[]
  pivot: string[]
  abandon: string[]
}

type QuestionReport = {
  score_box: ScoreBox
  point_of_interests: PointOfInterest[]
  strategy_insights: StrategyInsights
  total_answer: number
  total_viewers: number
  total_point_of_interests: number
}

async function getResearchById(id: string): Promise<Research> {
  const { userId } = auth();

  
  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const research = await db.query.researches.findFirst({
    where: eq(researches.id, id),
    with: {
      forms: {
        columns: {
          id: true
        },
        with: {
          answers: {
            with: {
              classifications: {
                columns: {
                  affinities: true,
                  names: true
                }
              }
            },
            columns: {
              purpose: true,
              score: true,
              sequence: true,
              explanation: true,
            }
          }
        }
      },
      questions: {
        columns: {
          purpose: true,
          sequence: true,
          explanation: true,
          score: true,
        },
        with: {
          categories: {
            columns: {
              name: true
            }
          }
        }
      }
    },
  }) as Research

  return research;
}
/*

async function getReportByResearchID(research: Research) {
  const questionsReport: QuestionReport[] = []
  const questionsCategories = research.questions.map(q => q.categories)

  questionsCategories.forEach((caregories, qindex) => {
    const answersByQuestion = answers.map(a => a.answers[qindex])
    const pointOfInterests = caregories.map(category => {
      const answersByCategory = answersByQuestion.filter(a => filterByCategory(a, 5, category.name))

      const pointOfInterest: PointOfInterest = {
        name: category.name,
        score_box: scoreBoxCalculation(answersByCategory),
        answers: answersByCategory,
      }

      return pointOfInterest
    })

    const questionReport: QuestionReport = {
      score_box: sumScoreBox(pointOfInterests),
      point_of_interests: pointOfInterests,
      strategy_insights: calculateStrategyInsights(pointOfInterests, caregories),
      total_point_of_interests: 0,
      total_answer: answers.length,
      total_viewers: 0,
    }

    questionReport.total_point_of_interests = calculateTotalPointsOfInterests(questionReport)

    questionsReport.push(questionReport)
  })

  const response: ReportGetResponse = {
    id: report.id,
    research_id: research.id,
    questions_report: questionsReport,
    created_at: report.created_at,
  }
}

*/
export default async function ResearchPage({ params }: Props) {
  const research = await getResearchById(params.id);

  if (!research) {
    return notFound();
  }

  return (
    <div className="relative">
      <header className="pt-4 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold leading-tight">
            {research.title}
          </h2>
        </div>
      </header>

      <section className="space-y-6">
        <p>{research.description}</p>

        <div>
          <p>Criado em: {formatters.date(research.createdAt)}</p>
          {<p>Respostas: {research.forms.length}</p>}
        </div>
        <div>
          {JSON.stringify(research, null, 2)}
        </div>

        <CopyLinkForm research={research.id} status={research.status} />
      </section>

      <CloseResearch research={research.id} status={research.status} />
    </div>
  );
}
