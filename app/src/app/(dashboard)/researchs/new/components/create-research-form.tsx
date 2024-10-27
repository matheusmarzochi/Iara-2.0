"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { schema } from "../schemas";
import type { z } from "zod";
import { useServerAction } from "zsa-react";
import { createResearchAction } from "../actions";
import { StatusButton } from "~/components/status-button";
import { toast } from "sonner";

type Schema = z.infer<typeof schema>;

export function CreateResearchForm() {
	const { execute, isPending } = useServerAction(createResearchAction, {
		onSuccess: () => {
			toast.success("Pesquisa criada.", {
				description: "Pesquisa criada com sucesso!",
			});
		},
		onError: (error) => {
			toast.error("Erro", {
				description:
					"Houve um erro ao tentar criar sua pesquisa, por favor tente novamente.",
			});
		},
	});

	const form = useForm<Schema>({
		defaultValues: {
			title: "",
			description: "",
			purposes: [
				{
					purpose: "",
				},
			],
		},
		mode: "onBlur",
		resolver: zodResolver(schema),
	});

	const { fields, append, remove } = useFieldArray<Schema>({
		control: form.control,
		name: "purposes",
	});

	const submit = () => {
		execute(form.getValues());
	};

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
				<div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="flex-1 lg:max-w-[345px]">
								<FormLabel>Título</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Digite o título do formulário"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Descrição</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className="resize-none lg:max-h-10 min-h-10"
										placeholder="Digite a descrição do formulário"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<h3 className="text-2xl font-semibold">Propósitos</h3>

					<div>
						{fields.map((field, index) => (
							<div
								key={field.id}
								className="border-b py-10 last:border-b-0 space-y-4"
							>
								{index > 0 ? (
									<div className="py-2">
										<Button
											size="sm"
											variant="outline"
											type="button"
											onClick={() => remove(index)}
										>
											Remover este propósito
										</Button>
									</div>
								) : null}

								<FormField
									control={form.control}
									name={`purposes.${index}.purpose`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Questão de Propósito</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													className="resize-none"
													placeholder="Porque você escolheu nosso produto ou serviço?"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						))}
					</div>

					<div className="pt-4 flex items-center justify-end lg:hidden">
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={() =>
								append({ purpose: "" })
							}
						>
							Adicionar Propósito
						</Button>
					</div>
				</div>

				<div className="flex gap-4 items-center justify-between [&>*]:w-full">
					<Button
						size="sm"
						variant="outline"
						type="button"
						className="lg:max-w-fit"
						asChild
					>
						<Link href="/dashboard">Voltar</Link>
					</Button>

					<div className="flex gap-4 justify-end">
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="hidden lg:flex"
							onClick={() =>
								append({ purpose: "" })
							}
						>
							Adicionar Propósito
						</Button>

						<StatusButton
							isPending={isPending}
							size="sm"
							className="w-full lg:w-[120px]"
						>
							Criar Pesquisa
						</StatusButton>
					</div>
				</div>
			</form>
		</Form>
	);
}
