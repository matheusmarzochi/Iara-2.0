import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { researches } from './research';
import { categories, type Category } from './category';

export const questions = pgTable(
    'questions',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        researchId: uuid('research_id').notNull().references(() => researches.id),
        purpose: text('purpose').notNull(),
        score: text('score').notNull(),
        explanation: text('explanation').notNull(),
        sequence: integer('sequence').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        researchId: index("questions_researchId_index").on(t.researchId),
    }),
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
    research: one(researches, {
        fields: [questions.researchId],
        references: [researches.id]
    }),
    categories: many(categories)
}))

export type Question = typeof questions.$inferSelect & { categories: Category[] };

export const createQuestionSchema = createInsertSchema(questions);