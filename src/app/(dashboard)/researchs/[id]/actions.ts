"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/database";
import { researches } from "~/database/schema";
import { actions } from "~/lib/actions";

export const closeResearchAction = actions
  .createServerAction()
  .input(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    await db
      .update(researches)
      .set({
        status: "PROCESSING",
        updatedAt: new Date(),
      })
      .where(
        and(eq(researches.id, input.id), eq(researches.userId, ctx.user.id)),
      );

    /** @todo adicionar a pesquisa na fila de processamento. */

    revalidatePath("/dashboard", "page");
    redirect("/dashboard");

    return { success: true };
  });
