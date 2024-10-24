import { auth } from "@clerk/nextjs/server";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "~/database";
import { forms, type Research, researches, users } from "~/database/schema";
import { cn, formatters } from "~/lib/utils";

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
			status: researches.status,
			createdAt: researches.createdAt,
			replies: count(forms.id),
		})
		.from(researches)
		.leftJoin(forms, eq(forms.researchId, researches.id))
		.where(eq(researches.userId, user))
		.orderBy(desc(researches.createdAt))
		.groupBy(researches.id);

	return researchs;
}

export default async function DashboardPage() {
	const researchs = await getUserResearchs();

	const status = (status: Research["status"]) =>
		({
			CREATED: (
				<Badge className="whitespace-nowrap w-fit bg-yellow-500 text-black">
					Em Andamento
				</Badge>
			),
			FINISHED: (
				<Badge className="whitespace-nowrap w-fit bg-green-400 text-black">
					Encerrada
				</Badge>
			),
			PROCESSING: (
				<Badge className="whitespace-nowrap w-fit bg-orange-500 text-black">
					Processando
				</Badge>
			),
		})[status];

	return (
		<>
			<section className="flex flex-col items-end md:items-start pt-4 pb-8 gap-6">
				<Button size="sm" className="order-1 md:order-2" asChild>
					<Link href="/researchs/new">Criar Formulário</Link>
				</Button>

				{researchs.length <= 0 ? (
					<section className="order-2 md:order-1">
						<p className="text-muted-foreground">
							Você não possui nenhum formulário. Clique em “Criar formulário”
							para descobrir as necessidades e expectativas dos seus clientes!
						</p>
					</section>
				) : null}
			</section>

			<section className="flex flex-col gap-6">
				{researchs.map((research) => (
					<Card key={research.id} className="relative">
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle className="text-xl">{research.title}</CardTitle>
								{status(research.status)}
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
