"use server";

import { actions } from "~/lib/actions";
import { researches } from "iara-shared/database/schema";
import { eq, and } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { date, z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

export const deleteResearchAction = actions
  .createServerAction()
  .input(schema)
  .handler(async ({ input, ctx }) => {

    await db
      .update(researches)
      .set({
        deletedAt: new Date()
      })
      .where(
        and(
          eq(researches.userId, ctx.user.id),
          eq(researches.id, input.id)
        )
      )

    revalidatePath("/dashboard", "page");
    redirect("/dashboard");
  });
