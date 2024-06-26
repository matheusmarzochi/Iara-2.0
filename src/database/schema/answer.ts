import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { forms } from './form';

export const answers = pgTable(
    'answers',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        formId: uuid('form_id').notNull().references(() => forms.id),
        score: integer('score').notNull(),
        explanation: text('explanation').notNull(),
        sequence: integer('sequence').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        formId: index("answers_formId_index").on(t.formId),
    }),
);

export const answersRelations = relations(answers, ({ one }) => ({
    form: one(forms, {
        fields: [answers.formId],
        references: [forms.id]
    }),
}))

export type Answer = typeof answers.$inferSelect;

export const createAnswerSchema = createInsertSchema(answers);
