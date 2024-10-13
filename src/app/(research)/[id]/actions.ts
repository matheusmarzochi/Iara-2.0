"use server";

import { createServerAction } from "zsa";
import { schema } from "./schema";
import { db } from "~/database";
import { answers, forms } from "~/database/schema";

export const replyResearchAction = createServerAction()
  .input(schema)
  .handler(async ({ input }) => {
    const { email, research, purposes } = input;

    const [form] = await db
      .insert(forms)
      .values({
        email,
        researchId: research,
      })
      .returning({ id: forms.id });

    await db.insert(answers).values(
      purposes.map((purpose) => ({
        ...purpose,
        formId: form.id,
        score: Number(purpose.score.replace(/\D+/g, "")),
      })),
    );

    return { success: true };
  });
