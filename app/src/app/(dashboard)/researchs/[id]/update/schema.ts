import { z } from "zod";

export const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Informe um título para sua pesquisa."),
  description: z.string().min(1, "Informe uma descrição para sua pesquisa."),
  purposes: z.array(
    z.object({
      id: z.string().uuid(),
      purpose: z.string().min(1, "Informe um título para esta pergunta."),
      required: z.boolean().nullable(),
    }),
  ),
});
