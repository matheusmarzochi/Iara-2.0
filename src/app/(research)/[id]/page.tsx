import { db } from "~/database";
import { ResearchForm } from "./components/research-form";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

async function getResearchForm(id: string) {
  return db.query.researches.findFirst({
    where: (research, { eq }) => eq(research.id, id),
    columns: {
      userId: false,
    },
    with: {
      questions: {
        with: {
          categories: true,
        },
      },
    },
  });
}

export default async function ResearchPage({ params }: Props) {
  const research = await getResearchForm(params.id);

  if (!research) {
    return notFound();
  }

  if (research.status !== "CREATED") {
    return (
      <section className="space-y-6 h-[calc(100dvh-160px)] flex items-center">
        <header className="pt-4 pb-6 space-y-4">
          <h2 className="text-3xl font-semibold leading-tight text-muted-foreground">
            Essa pesquisa foi encerrada.
          </h2>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="pt-4 pb-6 space-y-4">
        <h2 className="text-3xl font-semibold leading-tight">
          {research.title}
        </h2>
        <p className="text-sm">{research.description}</p>
      </header>

      <small className="inline-block text-muted-foreground italic">
        Os campos com * são obrigatórios
      </small>

      <ResearchForm research={params.id} questions={research.questions} />
    </section>
  );
}
