"use server";
import { db } from "iara-shared/database";
import { fitness } from "iara-shared/database/schema";
import { users } from "iara-shared/database/schema/user";
import { eq, and } from "iara-shared/node_modules/drizzle-orm";
import { auth } from "@clerk/nextjs/server";

type CreateFitnessInput = {
  name: string;
  researches: string[];
};

export async function createFitness({ name, researches }: CreateFitnessInput) {
  const { userId } = auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (!user) throw new Error("Usuário não encontrado");

  await db.insert(fitness).values({
    name,
    userId: user.id,
    researches,
  });
}

type UpdateFitnessInput = {
  id: string;
  name: string;
  researches: string[];
};

export async function updateFitness({ id, name, researches }: UpdateFitnessInput) {
    const { userId } = auth();
    if (!userId) throw new Error("Usuário não autenticado");

    const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);

    if (!user) throw new Error("Usuário não encontrado");

    await db
        .update(fitness)
        .set({ name, researches, updatedAt: new Date() })
        .where(eq(fitness.id, id));
}

export async function removeFitness(id: string) {
  const { userId } = auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (!user) throw new Error("Usuário não encontrado");

  await db
    .update(fitness)
    .set({ deletedAt: new Date() })
    .where(and(eq(fitness.id, id), eq(fitness.userId, user.id)));
}
