import { auth } from "@clerk/nextjs/server";
import { count, desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "~/database";
import { answers, forms, researches, users } from "~/database/schema";
import { formatters } from "~/lib/utils";

async function getUserResearchs() {
  const { userId } = auth();

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string));

  const researchs = await db
    .select({
      id: researches.id,
      title: researches.title,
      createdAt: researches.createdAt,
      replies: count(answers.id),
    })
    .from(researches)
    .leftJoin(forms, eq(forms.researchId, researches.id))
    .leftJoin(answers, eq(answers.formId, forms.id))
    .where(eq(researches.userId, user))
    .orderBy(desc(researches.createdAt))
    .groupBy(researches.id);

  console.log(researchs);

  return researchs;
}

export default async function DashboardPage() {
  const researchs = await getUserResearchs();

  return (
    <>
      <header className="flex items-center justify-end pt-4 pb-8">
        <Button size="sm" asChild>
          <Link href="/researchs/new">Criar Formulário</Link>
        </Button>
      </header>

      <section className="py-10 hidden">
        <p className="text-muted-foreground text-center">
          Você não possui nenhum formulário. Clique em “Criar formulário” para
          descobrir as necessidades e expectativas dos seus clientes!
        </p>
      </section>

      <section className="flex flex-col gap-6">
        {researchs.map((research) => (
          <Card key={research.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{research.title}</CardTitle>
                {/** @todo adicionar status */}
                <Badge className="whitespace-nowrap w-fit bg-yellow-500 text-black">
                  Em Andamento
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Criado em: {formatters.date(research.createdAt)}
              </p>
              <p className="text-sm">Respostas: {research.replies}</p>
            </CardContent>

            <Link
              className="absolute inset-0"
              href={`/researchs/${research.id}`}
            />
          </Card>
        ))}
      </section>
    </>
  );
}
