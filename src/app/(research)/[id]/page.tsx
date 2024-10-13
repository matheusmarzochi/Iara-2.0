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
      /** @todo remover campos não usados na seleção. */
      questions: {
        with: {
          categories: true,
        },
      },
    },
  });
}

/** @todo quando uma pesquisa não estiver com status em andamento, mostrar uma mensagem de pesquisa encerrada.  */
export default async function ResearchPage({ params }: Props) {
  const research = await getResearchForm(params.id);

  if (!research) {
    return notFound();
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
