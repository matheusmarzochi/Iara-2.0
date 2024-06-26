import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { users } from './user'
import { questions } from './question'
import { forms } from './form'

export const researches = pgTable(
    'researches',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        title: text('title').notNull(),
        description: text('description').notNull(),
        userId: uuid('user_id').notNull().references(() => users.id),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        userId: index("researches_userId_index").on(t.userId),
    }),
);

export const researchesRelations = relations(researches, ({ many }) => ({
    questions: many(questions),
    forms: many(forms)
}))

export type Research = typeof researches.$inferSelect;

export const createResearchSchema = createInsertSchema(researches);
