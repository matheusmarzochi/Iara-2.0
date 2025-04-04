import { db } from "iara-shared/database";
import { UpdateResearchForm } from "./components/update-research-form";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

async function getResearchWithQuestions(id: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("Unauthenticated");
  }

  return db.query.researches.findFirst({
    where: (research, { and, eq }) =>
      and(eq(research.id, id), eq(research.userId, user.id)),
    columns: {
      id: true,
      title: true,
      description: true,
    },
    with: {
      questions: {
        columns: {
          id: true,
          purpose: true,
          required: true,
        },
      },
    },
  });
}

export default async function UpdateResearchPage({ params }: Props) {
  const research = await getResearchWithQuestions(params.id);

  if (!research) {
    return notFound();
  }

  return (
    <>
      <header className="pt-4 pb-6 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold leading-tight">Formulário</h2>
          {/* <Button size="sm" variant="outline">
              Preview
            </Button> */}
        </div>

        <small className="text-muted-foreground inline-block">
          Você pode personalizar cada pergunta e escolher entre perguntas
          abertas ou de múltipla escolha.
        </small>
      </header>
      <UpdateResearchForm research={research} />
    </>
  );
}
