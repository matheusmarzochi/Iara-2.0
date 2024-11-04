"use server";

import { createServerAction } from "zsa";
import { schema } from "./schema";
import { db } from "iara-shared/database";
import { answers, forms } from "iara-shared/database/schema";

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
      purposes.map((purpose, index) => ({
        ...purpose,
        formId: form.id,
        sequence: index + 1,
        score: Number(purpose.score?.replace(/\D+/g, "")) || 0,
        purpose: purpose.purpose || "",
        explanation: purpose.explanation || "",
      })),
    );

    return { success: true };
  });
