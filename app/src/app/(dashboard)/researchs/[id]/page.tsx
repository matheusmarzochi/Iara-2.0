import { CopyLinkForm } from "./components/copy-link-form";
import { CloseResearch } from "./components/close-research";
import { db } from "~/database";
import { notFound } from "next/navigation";
import { formatters } from "~/lib/utils";
import { and, count, eq, inArray } from "drizzle-orm";
import { answers, forms, reports, Research, researches, users, Answer, categories } from "~/database/schema";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: {
    id: string;
  };
};


async function getResearchById(id: string) {
  const { userId } = auth();

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const [research] = await db
    .select({
      id: researches.id,
      title: researches.title,
      description: researches.description,
      status: researches.status,
      forms: count(forms.id),
      createdAt: researches.createdAt,
    })
    .from(researches)
    .leftJoin(forms, eq(forms.researchId, researches.id))
    .where(and(eq(researches.id, id), eq(researches.userId, user)))
    .limit(1)
    .groupBy(researches.id);

  return research;
}

async function getReportByResearchId(id: string) {
  const { userId } = auth();

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const report = await db.query.reports.findFirst({
    where: eq(reports.researchId, id)
  })

  return report;
}


export default async function ResearchPage({ params }: Props) {
  const research = await getResearchById(params.id);
  const report = await getReportByResearchId(params.id);

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
          <p>Respostas: {research.forms}</p>
        </div>
        <div>
          {JSON.stringify(report, null, 2)}
        </div>

        <CopyLinkForm research={research.id} status={research.status} />
      </section>

      <CloseResearch research={research.id} status={research.status} />
    </div>
  );
}
