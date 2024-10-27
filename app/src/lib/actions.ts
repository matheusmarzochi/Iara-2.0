import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";
import { db } from "iara-shared/database";
import type { User } from "iara-shared/database/schema";

export const actions = createServerActionProcedure().handler(async () => {
  const { userId } = auth();

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.clerkId, userId as string),
    columns: {
      clerkId: false,
    },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return { user } as { user: User };
});
