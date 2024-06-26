import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { researches } from './research';
import { answers } from './answer';

export const forms = pgTable(
    'forms',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        researchId: uuid('research_id').notNull().references(() => researches.id),
        email: text('email').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        researchId: index("forms_researchId_index").on(t.researchId),
    }),
);

export const formsRelations = relations(forms, ({ one, many }) => ({
    research: one(researches, {
        fields: [forms.researchId],
        references: [researches.id]
    }),
    answers: many(answers),
}))

export type Form = typeof forms.$inferSelect;

export const createFormSchema = createInsertSchema(forms);
