import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";

export const actions = createServerActionProcedure().handler(async () => {
  try {
    const { userId } = auth();

    return { user: { id: userId } };
  } catch {
    throw new Error("Unauthorized");
  }
});
