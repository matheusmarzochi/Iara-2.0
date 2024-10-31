import { z } from "zod";

export const schema = z.object({
	research: z.string().uuid(),
	email: z.string().email("Informe um e-mail válido"),
	purposes: z.array(
		z.object({
			purpose: z.string({ message: "Essa resposta é obrigatória" }).optional(),
			score: z.enum(["0", "1", "2", "3", "4", "5"]).optional(),
			explanation: z
				.string({ message: "Essa resposta é obrigatória" })
				.optional(),
			sequence: z.number().optional(),
		}),
	),
});
