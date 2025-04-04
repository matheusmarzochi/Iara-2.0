"use server";

import { actions } from "~/lib/actions";
import { schema } from "./schemas";
import { questions, researches } from "iara-shared/database/schema";
import { db } from "iara-shared/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createResearchAction = actions
  .createServerAction()
  .input(schema)
  .handler(async ({ input, ctx }) => {
    const { purposes, description, title } = input;

    const [research] = await db
      .insert(researches)
      .values({
        description,
        title,
        userId: ctx.user.id,
      })
      .returning({ id: researches.id });

    await db.insert(questions).values(
      purposes.map((purpose, index) => ({
        ...purpose,
        researchId: research.id,
        sequence: index + 1,
      })),
    );

    revalidatePath("/dashboard", "page");
    redirect("/dashboard");

    return { status: "success", data: input };
  });
