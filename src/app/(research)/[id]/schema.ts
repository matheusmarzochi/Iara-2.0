import { z } from "zod";

export const schema = z.object({
  research: z.string().uuid(),
  email: z.string().email("Informe um e-mail válido"),
  purposes: z.array(
    z.object({
      purpose: z.string().min(1, "Essa resposta é obrigatória"),
      score: z.enum(["0", "1", "2", "3", "4", "5"]),
      explanation: z.string().min(1, "Essa resposta é obrigatória"),
      sequence: z.number(),
    }),
  ),
});
