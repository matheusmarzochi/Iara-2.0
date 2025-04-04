import { z } from "zod";

export const schema = z.object({
	title: z.string().min(1, "Informe um título para sua pesquisa."),
	description: z.string().min(1, "Informe uma descrição para sua pesquisa."),
	purposes: z.array(
		z.object({
			purpose: z.string().min(1, "Informe um título para esta pergunta."),
			required: z.boolean().nullable(),
		}),
	),
});
