"use server"

import { db } from "iara-shared/database"
import { eq } from "iara-shared/node_modules/drizzle-orm"
import { fitness } from "iara-shared/database/schema/fitness"
import { duplicateResearch } from "./research"

export const duplicateFitness = async (userId: string, fitnessId: string) => {
    const originalFitness = await db.query.fitness.findFirst({
        where: eq(fitness.id, fitnessId),
    });

    if (!originalFitness) return undefined;

    const researchList: string[] = []
    for (const researchId of originalFitness.researches) {
        const newResearchId = await duplicateResearch(userId, researchId);
        if (newResearchId) {
            researchList.push(newResearchId)
        }
    }

    const { id: _, userId: __, createdAt: ___, updatedAt, deletedAt, ...restFitness } = originalFitness;
    const [newFitness] = await db
        .insert(fitness)
        .values({
            name: originalFitness.name,
            researches: researchList,
            userId,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
        })
        .returning();

    return newFitness;
}