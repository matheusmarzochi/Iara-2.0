import { index, pgEnum, pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { questions } from './question';

export const analysisCriteria = pgEnum("analysis_criteria", [
    'PIVOT',
    'IMPROVE',
    'MAINTAIN',
    'ABANDON',
    'FOCUS',
    'RETHINK'
]);

export const analysis = pgTable(
    'analysis',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        questionId: uuid('question_id').notNull().references(() => questions.id),
        criteria: analysisCriteria("criteria").notNull(),
        action: text('action').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        questionId: index("analysis_questionId_index").on(t.questionId),
        questionIdCriteriaUnique: unique("analysis_questionId_criteria_unique").on(t.questionId, t.criteria),
    }),
);

export const analysisRelations = relations(analysis, ({ one }) => ({
    question: one(questions, {
        fields: [analysis.questionId],
        references: [questions.id]
    }),
}))

export type Analysis = typeof analysis.$inferSelect;

export const createAnalysisSchema = createInsertSchema(analysis);
