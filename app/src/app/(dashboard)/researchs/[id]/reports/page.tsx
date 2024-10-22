import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { db } from "~/database";
import { researches, users, reports, type Report, StrategyKeys } from "~/database/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

type Props = {
  params: {
    id: string;
  };
};

async function getResearchById({ id }: { id: string }) {
  const { userId } = auth();

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const [research] = await db
    .select({
      id: researches.id,
      title: researches.title,
    })
    .from(researches)
    .where(and(eq(researches.id, id), eq(researches.userId, user)))
    .limit(1);

  return research;
}

async function getReportByResearchId({ id }: { id: string }): Promise<Report | undefined> {
  const report = await db.query.reports.findFirst({
      where: eq(reports.researchId, id)
  })

  return report;
}

export default async function ReportsPage({ params }: Props) {
  const research = await getResearchById({ id: params.id });
  const report = await getReportByResearchId({ id: params.id });

  if (!research || !report) {
    return notFound();
  }

  const getStrategy = (key: StrategyKeys) => {
    return {
      improve: (
        <h4 className="text-lg font-bold text-green-600">
          Mantêr/Estimar/Aprimorar
        </h4>
      ),
      adjust: (
        <h4 className="text-lg font-bold text-green-600">Ajustar Estratégia</h4>
      ),
      develop: (
        <h4 className="text-lg font-bold text-yellow-600">
          Melhorar e Ajustar
        </h4>
      ),
      focus: (
        <h4 className="text-lg font-bold text-yellow-600">Vale dar Foco</h4>
      ),
      pivot: <h4 className="text-lg font-bold text-red-600">Pivotar</h4>,
      abandon: <h4 className="text-lg font-bold text-yellow-600">Abandonar</h4>,
    }[key];
  };

  return (
    <div>
      <header className="space-y-6">
        <h2 className="text-xl font-bold">{research.title}</h2>
        <h3 className="text-lg font-bold">Resultados</h3>
      </header>

      <Tabs className="mt-4">
        <TabsList>
          {report.data.map((question, index) => (
            <TabsTrigger
              value={question.question_id}
              key={question.question_id}
            >
              Propósito {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {report.data.map((question) => (
          <TabsContent
            className="space-y-8"
            value={question.question_id}
            key={question.question_id}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Score Box</h3>
              <h4 className="font-medium text-blue-500">
                {Math.round(100 * question.score_box.fit / question.total_forms)}/
                {Math.round(100 * question.score_box.neutral / question.total_forms)}/
                {Math.round(100 * question.score_box.unfit / question.total_forms)}
                {" "}({question.total_forms})
              </h4>

              <div className="space-y-2">
                <p className="text-sm">
                  Total de propósito informados: {question.total_forms}
                </p>
                <p className="text-sm">
                  Fit: {Math.round(100 * question.score_box.fit / question.total_forms)}%
                  Regular:{" "}{Math.round(100 * question.score_box.neutral / question.total_forms)}%
                  Não atende:{" "}{Math.round(100 * question.score_box.unfit / question.total_forms)}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Resultado das Categorias de propostas
              </h3>

              <Accordion type="multiple">
                {question.point_of_interests.map((interest) => (
                  <AccordionItem value={interest.name} key={interest.name}>
                    <AccordionTrigger>
                      {interest.name} [
                        {Math.round(100 * interest.score_box.fit / interest.answers.length)}:
                        {Math.round(100 * interest.score_box.neutral / interest.answers.length)}:
                        {Math.round(100 * interest.score_box.unfit / interest.answers.length)}]
                        ({interest.answers.length}/{question.total_forms})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      {interest.answers.map((answer, index) => (
                        <div key={index} className="space-y-2 text-balance">
                          <p className="text-sm">{answer.purpose}</p>

                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Porque</h4>
                            <p className="text-sm">{answer.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Decisões Estratégicas</h3>

              <div className="space-y-4">
                {Object.keys(question.strategy_insights)
                  .filter((key) =>
                    Boolean(
                      question.strategy_insights[key as StrategyKeys].length,
                    ),
                  )
                  .map((key) => (
                    <div key={key}>
                      {getStrategy(key as StrategyKeys)}

                      <ul className="list-disc pl-8">
                        {question.strategy_insights[key as StrategyKeys].map(
                          (insight) => (
                            <li key={insight}>
                              <p className="text-sm font-light">{insight}</p>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
