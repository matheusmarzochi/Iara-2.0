"use server";

import { and, eq } from "iara-shared/node_modules/drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "iara-shared/database";
import { researches } from "iara-shared/database/schema";
import { actions } from "~/lib/actions";
import { producer } from '~/queue'
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

    await producer.send(input.id)

    revalidatePath("/dashboard", "page");
    redirect("/dashboard");

    return { success: true };
  });
