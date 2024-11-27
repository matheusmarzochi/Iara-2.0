"use server";

import { actions } from "~/lib/actions";
import { questions, researches } from "iara-shared/database/schema";
import { and, eq } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

export const deleteResearchAction = actions
  .createServerAction()
  .input(schema)
  .handler(async ({ input, ctx }) => {
    const { id } = input;

    /**
     * @todo update the deleted_at from the research table
     */

    revalidatePath("/dashboard", "page");
    redirect("/dashboard");

    return { status: "success", data: input };
  });
