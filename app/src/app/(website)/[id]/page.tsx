"use server"
import { db } from "iara-shared/database";
import { ResearchForm } from "./components/research-form";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { researchViews } from "iara-shared/database/schema/research_view";
import { headers } from "next/headers";

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
					categories: {
						with: {
							analysis: true
						}
					},
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

	const sessionCookieName = 'sessionId'
	const cookieStore = cookies()
  	const sessionId = cookieStore.get(sessionCookieName)?.value;

	const forwardedFor = headers().get('x-forwarded-for');
	const ip = forwardedFor?.split(',')[0]?.trim();

	if (sessionId) {
		await db.insert(researchViews)
			.values({ researchId: params.id, sessionId, ip: ip ?? "" })
			.onConflictDoNothing();
	}

	return research.status !== "CREATED" && research.status !== "OPENED"
		? <section className="space-y-6 h-[calc(100dvh-160px)] flex items-center">
			<header className="pt-4 pb-6 space-y-4">
				<h2 className="text-3xl font-semibold leading-tight text-muted-foreground">
					Essa pesquisa foi encerrada.
				</h2>
			</header>
		</section>
		:
		<section className="space-y-6 container">
			<header className="pt-4 pb-6 space-y-4">
				<h2 className="text-3xl font-semibold leading-tight">
					{research.title}
				</h2>
				<p className="text-sm">{research.description}</p>

				<small className="inline-block text-muted-foreground italic">
					Os campos com * são obrigatórios
				</small>
			</header>

			<ResearchForm research={params.id} questions={research.questions} />
		</section>
}
