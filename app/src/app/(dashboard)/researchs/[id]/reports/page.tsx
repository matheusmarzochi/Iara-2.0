import { auth } from "@clerk/nextjs/server";
import { and, eq } from "iara-shared/node_modules/drizzle-orm";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { db } from "iara-shared/database";
import {
  researches,
  users,
  reports,
  type Report,
  type StrategyKeys,
  type ReportAwnser,
  type Research,
} from "iara-shared/database/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ArrowLeftIcon, ChevronLeftIcon, MoveLeftIcon } from "lucide-react";

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
      status: researches.status,
    })
    .from(researches)
    .where(and(eq(researches.id, id), eq(researches.userId, user)))
    .limit(1);

  return research;
}

async function getReportByResearchId({
  id,
}: {
  id: string;
}): Promise<Report | undefined> {
  const report = await db.query.reports.findFirst({
    where: eq(reports.researchId, id),
  });

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

  const status = (status: Research["status"]) =>
    ({
      CREATED: (
        <Badge className="whitespace-nowrap w-fit bg-yellow-500 text-black hover:bg-yellow-400">
          Em Andamento
        </Badge>
      ),
      FINISHED: (
        <Badge className="whitespace-nowrap w-fit bg-green-400 text-black hover:bg-green-300">
          Encerrada
        </Badge>
      ),
      PROCESSING: (
        <Badge className="whitespace-nowrap w-fit bg-orange-500 text-black hover:bg-orange-400">
          Processando
        </Badge>
      ),
    })[status];

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
          {status(research.status)}
        </div>
        <h3 className="text-lg font-bold">Resultados</h3>
      </header>

      <Tabs defaultValue={report.data.length ? report.data[0].question_id : ""}>
        <TabsList className="my-4">
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
            className="mt-0 flex flex-col gap-x-6 gap-y-4 grid-row-[20px_1fr] md:grid md:grid-cols-2"
            value={question.question_id}
            key={question.question_id}
          >
            <h4 className="font-semibold text-lg col-span-2">
              {question.question_propose}
            </h4>

            <div className="contents space-y-6 md:block row-start-2">
              {/* Score Box */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Score Box</h3>
                <h4>
                  <strong className="text-green-500">
                    {Math.round(
                      (100 * question.score_box.fit) / question.total_forms,
                    )}
                  </strong>
                  /
                  <strong className="text-yellow-500">
                    {Math.round(
                      (100 * question.score_box.neutral) / question.total_forms,
                    )}
                  </strong>
                  /
                  <strong className="text-red-500">
                    {Math.round(
                      (100 * question.score_box.unfit) / question.total_forms,
                    )}
                  </strong>
                  <span className="pl-2">({question.total_forms})</span>
                </h4>

                <div className="space-y-2">
                  <p className="text-sm">
                    Total de propósito informados: {question.total_forms}
                  </p>
                  <p className="text-sm space-x-6">
                    <span className="text-green-500">
                      {Math.round(
                        (100 * question.score_box.fit) / question.total_forms,
                      )}
                      % Fit
                    </span>
                    <span className="text-yellow-500">
                      {Math.round(
                        (100 * question.score_box.neutral) /
                          question.total_forms,
                      )}
                      % Regular
                    </span>
                    <span className="text-red-500">
                      {Math.round(
                        (100 * question.score_box.unfit) / question.total_forms,
                      )}
                      % Unfit
                    </span>
                  </p>
                </div>
              </div>

              {/* Strategy keys sections
							<div className="order-3 space-y-4">
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
							*/}
            </div>

            {/* Results and replies */}
            <div className="order-2 row-start-2">
              <h3 className="text-lg font-semibold">
                Resultado das Categorias de propostas
              </h3>

              <Accordion type="multiple">
                {question.point_of_interests.map((interest) => (
                  <AccordionItem value={interest.name} key={interest.name}>
                    <AccordionTrigger className="text-left">
                      {interest.name} [
                      {Math.round(
                        (100 * interest.score_box.fit) /
                          interest.answers.length,
                      )}
                      :
                      {Math.round(
                        (100 * interest.score_box.neutral) /
                          interest.answers.length,
                      )}
                      :
                      {Math.round(
                        (100 * interest.score_box.unfit) /
                          interest.answers.length,
                      )}
                      ] ({interest.answers.length}/{question.total_forms})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <h4 className="font-bold text-md">
                        Nos conte por qual objetivo ou razão escolheu nosso
                        produto/serviço?
                      </h4>
                      <InterestGroupedAnwsers answers={interest.answers} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

type GroupClassification = "unfit" | "regular" | "fit";
type GroupAnswer = Record<GroupClassification, Array<ReportAwnser>>;

function InterestGroupedAnwsers({ answers }: { answers: Array<ReportAwnser> }) {
  const grouped: GroupAnswer = answers.reduce(
    (acc, answer) => {
      if (answer.score > 3) {
        acc.fit = [...acc.fit, answer];
      }

      if (answer.score > 1 && answer.score <= 3) {
        acc.regular = [...acc.regular, answer];
      }

      if (answer.score <= 1) {
        acc.unfit = [...acc.unfit, answer];
      }

      return acc;
    },
    { fit: [], regular: [], unfit: [] } as GroupAnswer,
  );

  const getBadge = (key: "unfit" | "regular" | "fit") =>
    ({
      unfit: (
        <Badge className="bg-red-500 text-white hover:bg-red-500">Unfit</Badge>
      ),
      regular: (
        <Badge className="bg-yellow-500 text-white hover:bg-yellow-500">
          Regular
        </Badge>
      ),
      fit: (
        <Badge className="bg-green-500 text-white hover:bg-green-500">
          Fit
        </Badge>
      ),
    })[key];

  return (Object.keys(grouped) as Array<GroupClassification>)
    .filter((key) => Boolean(grouped[key].length))
    .map((key) => {
      const answers = grouped[key];

      return (
        <Card key={key}>
          <CardContent className="px-6 py-2 bg-muted-foreground/5 dark:bg-sky-900">
            <div className="mb-2">{getBadge(key)}</div>

            <div className="space-y-2">
              {/* @todo add an answer.id here to avoid use index */}
              {answers.map((answer, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="space-y-2 text-balance border-b border-gray-700 last:border-none pb-4"
                >
                  <p className="text-sm">{answer.purpose}</p>

                  <div className="space-y-1">
                    <h4 className="text-sm italic text-muted-foreground">
                      Porque
                    </h4>
                    <p className="text-sm">{answer.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    });
}
