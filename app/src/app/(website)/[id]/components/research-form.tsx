"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import type { Question } from "iara-shared/database/schema";
import { schema } from "../schema";
import { useServerAction } from "zsa-react";
import { replyResearchAction } from "../actions";
import { StatusButton } from "~/components/status-button";
import type { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";

type Schema = z.infer<typeof schema>;

type Props = {
	research: string;
	questions: Array<Question>;
};

function usePurposeParams(maxPurposesLength: number) {
	const params = useSearchParams();
	const paramsPurpose = params.get("purpose");

	if (!paramsPurpose || Number(paramsPurpose) < 1) {
		return 1;
	}

	if (Number(paramsPurpose) > maxPurposesLength) {
		return maxPurposesLength;
	}

	return Number(paramsPurpose);
}

export function ResearchForm({ questions, research }: Props) {
	const router = useRouter();

	const { execute, isPending } = useServerAction(replyResearchAction, {
		onSuccess: () => {
			toast.success("Obrigado", {
				description:
					"Sua resposta foi registrada, muito obrigado pela sua resposta.",
			});

			form.reset();
			router.push(`/${research}/obrigado`);
		},
		onError: () => {
			toast.error("Ops", {
				description:
					"Não foi possível registrar sua resposta, tente novamente por favor.",
			});
		},
	});

	const HAS_MULTIPLE_PURPOSES = questions.length > 1;

	const CURRENT_PURPOSE = usePurposeParams(questions.length);
	const HAS_NEXT_PURPOSE = CURRENT_PURPOSE < questions.length;
	const HAS_PREV_PURPOSE = CURRENT_PURPOSE > 1;

	const form = useForm<Schema>({
		defaultValues: {
			research,
			email: "",
			purposes: questions.map((question) => ({
				explanation: "",
				purpose: "",
				score: "5",
				sequence: question.sequence,
			})),
		},
		mode: "onBlur",
		resolver: zodResolver(schema),
	});

	const submit = () => {
		execute(form.getValues());
	};

	const currentPurposeValues = form.getValues().purposes[CURRENT_PURPOSE - 1];
	const currentQuestion = questions[CURRENT_PURPOSE - 1];

	const disableNextPurpose =
		currentQuestion.required &&
		!Object.values(currentPurposeValues).every(Boolean);

	// Validate if all required purposes are filled
	const hasMissingRequiredFields = questions
		.filter(({ required }) => required)
		.some(({ sequence }) => {
			return !Object.values(form.getValues().purposes[sequence - 1]).every(
				Boolean,
			);
		});

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="w-full max-w-80">
							<FormLabel>*Email</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
							<FormDescription>
								Seu e-mail é confidencial e não será compartilhado com
								terceiros.
							</FormDescription>
						</FormItem>
					)}
				/>

				{questions.map((question, index) => {
					if (HAS_MULTIPLE_PURPOSES && index + 1 !== Number(CURRENT_PURPOSE)) {
						return null;
					}

					return (
						<div key={question.id} className="space-y-3 w-full max-w-[700px]">
							<h3 className="text-lg font-bold">Propósito {index + 1}</h3>

							<FormField
								control={form.control}
								name={`purposes.${index}.purpose`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{question.required ? "*" : null} {question.purpose}
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												className="resize-none"
												placeholder="Digite sua reposta"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={`purposes.${index}.score`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											* Com base na resposta acima, poderia nos dizer o quanto conseguimos atender às suas expectativas?
										</FormLabel>
										<FormControl>
											<RadioGroup
												defaultValue={field.value}
												onValueChange={field.onChange}
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="5" />
													</FormControl>
													<FormLabel>
														<span className="text-[#22C55E]">Extremamente satisfeito(a)</span>{" "}
														- Recebi tudo que esperava e mais um pouico.
													</FormLabel>
												</FormItem>

												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="4" />
													</FormControl>
													<FormLabel>
														<span className="text-[#22C55E]">Plenamente satisfeito(a)</span> -
														Tudo que eu precisava foi atendido.
													</FormLabel>
												</FormItem>

												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="3" />
													</FormControl>
													<FormLabel>
														<span className="text-yellow-500">
															Na maior parte satisfeito(a)
														</span>{" "}
														- Em geral foi atendido,mas algo ficou faltando.
													</FormLabel>
												</FormItem>

												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="2" />
													</FormControl>
													<FormLabel>
														<span className="text-yellow-500">
															Parcialmente satisfeito(a)
														</span>{" "}
														- Alguns pontos foram ok, mas uma parte relevante
														deixou a desejar.
													</FormLabel>
												</FormItem>

												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="1" />
													</FormControl>
													<FormLabel>
														<span className="text-red-500">Um pouco satisfeito(a)</span> -
														Houve itens positivos, mas a real necessidade não
														foi atendida.
													</FormLabel>
												</FormItem>

												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="0" />
													</FormControl>
													<FormLabel>
														<span className="text-red-500">Nada satisfeito(a)</span> -
														Nenhuma das minhas necessidades foi atendida.
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={`purposes.${index}.explanation`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>* Conte-nos porque você deu sua nota</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												className="resize-none"
												placeholder="Digite sua reposta"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					);
				})}

				<div
					className={cn(
						"flex flex-col md:flex-row w-full gap-2 md:items-center md:justify-end",
						{
							"md:justify-between": HAS_MULTIPLE_PURPOSES && HAS_PREV_PURPOSE,
						},
					)}
				>
					{HAS_MULTIPLE_PURPOSES && HAS_PREV_PURPOSE ? (
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="w-full md:w-fit"
							asChild
						>
							<Link
								href={`/${research}?purpose=${Number(CURRENT_PURPOSE) - 1}`}
							>
								Propósito Anterior
							</Link>
						</Button>
					) : null}

					{HAS_MULTIPLE_PURPOSES && HAS_NEXT_PURPOSE ? (
						<Button
							type="button"
							size="sm"
							disabled={Boolean(disableNextPurpose)}
							onClick={() =>
								router.push(
									`/${research}?purpose=${Number(CURRENT_PURPOSE) + 1}`,
								)
							}
						>
							Próximo Propósito
						</Button>
					) : null}

					{!HAS_MULTIPLE_PURPOSES || CURRENT_PURPOSE === questions.length ? (
						<StatusButton
							className="w-full md:w-[140px]"
							size="sm"
							isPending={isPending}
							disabled={hasMissingRequiredFields}
						>
							Enviar Formulário
						</StatusButton>
					) : null}
				</div>
			</form>
		</Form>
	);
}
function useEffect(arg0: () => () => void, arg1: never[]) {
	throw new Error("Function not implemented.");
}

function useState(arg0: boolean): [any, any] {
	throw new Error("Function not implemented.");
}

