"use server";

import { actions } from "~/lib/actions";
import { updateSchema } from "./schema";
import { questions, researches } from "iara-shared/database/schema";
import { and, eq } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateResearchAction = actions
  .createServerAction()
  .input(updateSchema)
  .handler(async ({ input, ctx }) => {
    const { purposes, description, title, id } = input;

    await db.transaction(async (tx) => {
      await tx
        .update(researches)
        .set({ description, title })
        .where(and(eq(researches.id, id), eq(researches.userId, ctx.user.id)));

      for (const purpose of purposes) {
        const { id: qid, ...data } = purpose;
        await tx
          .update(questions)
          .set(data)
          .where(and(eq(questions.id, qid), eq(questions.researchId, id)));
      }
    });

    revalidatePath(`/researchs/${id}`, "page");
    redirect(`/researchs/${id}`);

    return { status: "success", data: input };
  });
