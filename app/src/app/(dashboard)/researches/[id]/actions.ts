"use server";

import { and, eq } from "iara-shared/node_modules/drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "iara-shared/database";
import { researches } from "iara-shared/database/schema";
import { actions } from "~/lib/actions";
import { producer } from '~/queue'
import { 
  sendResearchStatusUpdateNotification,
  sendResearchDeletedNotification
} from "iara-shared/discord";

export const closeResearchAction = actions
  .createServerAction()
  .input(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const research = await db
      .select()
      .from(researches)
      .where(
        and(eq(researches.id, input.id), eq(researches.userId, ctx.user.id)),
      )
      .then((res) => res[0]);

    if (!research) {
      throw new Error("Research not found or you do not have permission to update it.");
    }

    await db
      .update(researches)
      .set({
        status: "PROCESSING",
        updatedAt: new Date(),
      })
      .where(eq(researches.id, input.id));

    await producer.send(input.id);

    await sendResearchStatusUpdateNotification(
      ctx.user.email,
      research.title,
      "PROCESSING",
      input.id
    );

    revalidatePath("/dashboard", "page");
    redirect("/dashboard");

    return { success: true };
  });
  export const removeResearchAction = actions
    .createServerAction()
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .handler(async ({ input, ctx }) => {
      const research = await db
        .select()
        .from(researches)
        .where(
          and(eq(researches.id, input.id), eq(researches.userId, ctx.user.id)),
        )
        .then((res) => res[0]);

      if (!research) {
        throw new Error("Research not found or you do not have permission to delete it.");
      }

      await db
        .update(researches)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(researches.id, input.id));

      await sendResearchDeletedNotification(ctx.user.email, research.title, input.id);
      
      revalidatePath("/dashboard", "page");
      redirect("/dashboard");

      return { success: true };
    });
