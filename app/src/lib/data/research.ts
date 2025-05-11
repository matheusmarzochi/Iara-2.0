"use server"

import { db } from "iara-shared/database"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"
import { Research, researches, researchViews } from "iara-shared/database/schema"

export const adminGetResearch = async (researchId: string): Promise<Research | undefined> => {
    const research = await db.query.researches.findFirst({
        where: eq(researches.id, researchId),
        with: {
            questions: {
                with: {
                    categories: {
                        with: {
                            analysis: true,
                            question: true,
                        },
                    },
                },
            },
            forms: {
                with: {
                    answers: {
                        with: {
                            classifications: true,
                        },
                    },
                }
            }
        }
    })

    return research
}

export const adminGetUniqueView = async (researchId: string): Promise<number> => {
    const uniqueViews = await db
        .select({
            uniqueViews: countDistinct(researchViews.sessionId),
        })
        .from(researchViews)
        .where(eq(researchViews.researchId, researchId));

    return uniqueViews[0]?.uniqueViews || 0;
}