import { index, pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { questions } from './question';
import { Analysis, analysis } from './analysis';

export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        questionId: uuid('question_id').notNull().references(() => questions.id),
        name: text('name').notNull(),
        target: boolean('target').notNull().default(false),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        questionId: index("categories_questionId_index").on(t.questionId),
    }),
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    question: one(questions, {
        fields: [categories.questionId],
        references: [questions.id]
    }),
    analysis: many(analysis)
}))

export type Category = typeof categories.$inferSelect & { analysis: Analysis[] };

export const createCategorySchema = createInsertSchema(categories);
