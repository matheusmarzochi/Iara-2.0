import { CopyLinkForm } from "./components/copy-link-form";
import { CloseResearch } from "./components/close-research";
import { db } from "iara-shared/database";
import { notFound } from "next/navigation";
import { formatters } from "~/lib/utils";
import { and, count, eq, inArray } from "iara-shared/node_modules/drizzle-orm";
import {
	forms,
	reports,
	type Research,
	researches,
	users,
} from "iara-shared/database/schema";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";

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

export default async function ResearchPage({ params }: Props) {
	const research = await getResearchById(params.id);

	if (!research) {
		return notFound();
	}

	const isResearchActive = research.status === "CREATED";
	const isResearchFinished = research.status === "FINISHED";

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
		<div className="relative">
			<header className="pt-4 pb-6 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
						<h2 className="text-3xl font-semibold leading-tight">
							{research.title}
						</h2>

						{status(research.status)}
					</div>
				</div>
			</header>

			<section className="space-y-6">
				<p>{research.description}</p>

				<div>
					<p>Criado em: {formatters.date(research.createdAt)}</p>
					<p>Respostas: {research.forms}</p>
				</div>

				{isResearchActive ? (
					<CopyLinkForm research={research.id} status={research.status} />
				) : null}

				{isResearchFinished ? (
					<div className="text-balance space-y-4">
						<p className="text-sm">
							Sua pesquisa foi precessada, você pode ver os seus resultados
							clicando no botão abaixo:
						</p>

						<Button size="sm" className="gap-2 group" asChild>
							<Link href={`/researchs/${research.id}/reports`}>
								Ver Relatório{" "}
								<MoveRightIcon className="size-4 group-hover:translate-x-1 transition-all" />
							</Link>
						</Button>
					</div>
				) : null}
			</section>

			{isResearchActive ? (
				<CloseResearch research={research.id} status={research.status} />
			) : null}
		</div>
	);
}
