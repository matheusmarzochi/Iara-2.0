import { index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";
import { researches } from './research';

export const questions = pgTable(
    'questions',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        researchId: uuid('research_id').references(() => researches.id),
        purpose: text('purpose').notNull(),
        score: text('score').notNull(),
        explanation: text('explanation').notNull(),
        sequence: integer('sequence').notNull(),
    },
    (t) => ({
        researchId: index("questions_researchId_index").on(t.researchId),
    }),
);

export type Question = typeof questions.$inferSelect;

export const createQuestionSchema = createInsertSchema(questions);