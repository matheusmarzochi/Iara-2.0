import { index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";
import { forms } from './form';

export const answers = pgTable(
    'answers',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        formId: uuid('form_id').references(() => forms.id),
        score: integer('score').notNull(),
        explanation: text('explanation').notNull(),
        sequence: integer('sequence').notNull(),
    },
    (t) => ({
        formId: index("answers_formId_index").on(t.formId),
    }),
);

export type Answer = typeof answers.$inferSelect;

export const createAnswerSchema = createInsertSchema(answers);
