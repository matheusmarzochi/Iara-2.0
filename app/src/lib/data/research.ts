"use server"

import { db } from "iara-shared/database"
import { eq, countDistinct } from "iara-shared/node_modules/drizzle-orm"
import { Research, researches, researchViews, questions, categories, forms, analysis, answers, classifications} from "iara-shared/database/schema"
import { reports } from "iara-shared/database/schema/report"

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

export const duplicateResearch = async (userId: string, researchId: string) => {
    const research = await db.query.researches.findFirst({
        where: eq(researches.id, researchId),
        with: {
            questions: {
                with: {
                    categories: {
                        with: {
                            analysis: true,
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
    });
    if (!research) return undefined;

    const { id: _, userId: __, createdAt: ___, updatedAt, deletedAt, ...restResearch } = research;
    const [newResearch] = await db
        .insert(researches)
        .values({
            ...restResearch,
            userId,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
        })
        .returning();

    // Duplicar report, se existir
    const report = await db.query.reports.findFirst({
        where: eq(reports.researchId, researchId),
    });
    if (report) {
        const { id: _, researchId: __, createdAt: ___, ...restReport } = report;
        await db.insert(reports).values({
            ...restReport,
            researchId: newResearch.id,
            createdAt: new Date(),
        });
    }

    const questionIdMap = new Map<string, string>();
    const categoryIdMap = new Map<string, string>();
    for (const question of research.questions) {
        const { id: oldQId, researchId: _, createdAt: __, ...restQ } = question;
        const [newQuestion] = await db
            .insert(questions)
            .values({
                ...restQ,
                researchId: newResearch.id,
                createdAt: new Date(),
            })
            .returning();
        questionIdMap.set(oldQId, newQuestion.id);

        for (const category of question.categories) {
            const { id: oldCId, questionId: _, createdAt: __, ...restC } = category;
            const [newCategory] = await db
                .insert(categories)
                .values({
                    ...restC,
                    questionId: newQuestion.id,
                    createdAt: new Date(),
                })
                .returning();
            categoryIdMap.set(oldCId, newCategory.id);

            for (const analysisItem of category.analysis) {
                const { id: _, categoryId: __, createdAt: ___, ...restA } = analysisItem;
                await db.insert(analysis).values({
                    ...restA,
                    categoryId: newCategory.id,
                    createdAt: new Date(),
                });
            }
        }
    }

    for (const form of research.forms) {
        const { id: oldFId, researchId: _, createdAt: __, ...restF } = form;
        const [newForm] = await db
            .insert(forms)
            .values({
                ...restF,
                researchId: newResearch.id,
                createdAt: new Date(),
            })
            .returning();

        for (const answer of form.answers) {
            const { id: oldAId, formId: _, createdAt: __, ...restA } = answer;
            const [newAnswer] = await db
                .insert(answers)
                .values({
                    ...restA,
                    formId: newForm.id,
                    createdAt: new Date(),
                })
                .returning();

            for (const classification of answer.classifications) {
                const { id: _, answerId: __, createdAt: ___, ...restC } = classification;
                await db.insert(classifications).values({
                    ...restC,
                    answerId: newAnswer.id,
                    createdAt: new Date(),
                });
            }
        }
    }

    return newResearch;
}