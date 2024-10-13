import { CopyLinkForm } from "./components/copy-link-form";
import { CloseResearch } from "./components/close-research";
import { db } from "~/database";
import { notFound } from "next/navigation";
import { formatters } from "~/lib/utils";
import { count, eq, inArray } from "drizzle-orm";
import { answers, forms } from "~/database/schema";

type Props = {
  params: {
    id: string;
  };
};

async function getResearchById(id: string) {
  const research = await db.query.researches.findFirst({
    where: (research, { eq }) => eq(research.id, id),
    columns: {
      userId: false,
    },
  });

  if (!research) {
    return null;
  }

  const [{ count: replies }] = await db
    .select({ count: count(answers.formId) })
    .from(answers)
    .where(
      inArray(
        answers.formId,
        db
          .select({ id: forms.id })
          .from(forms)
          .where(eq(forms.researchId, research.id)),
      ),
    );

  return { ...research, answers: replies };
}

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
          <p>Respostas: {research.answers}</p>
        </div>

        <CopyLinkForm research={research.id} />
      </section>

      <CloseResearch />
    </div>
  );
}
