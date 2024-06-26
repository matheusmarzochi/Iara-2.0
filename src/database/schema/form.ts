import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { researches } from './research';

export const forms = pgTable(
    'forms',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        researchId: uuid('research_id').references(() => researches.id),
        email: text('email').notNull(),
    },
    (t) => ({
        researchId: index("forms_researchId_index").on(t.researchId),
    }),
);

export type Form = typeof forms.$inferSelect;

export const createFormSchema = createInsertSchema(forms);
