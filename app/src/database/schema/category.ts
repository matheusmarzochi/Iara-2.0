import { index, pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { questions } from './question';

export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        questionId: uuid('question_id').notNull().references(() => questions.id),
        name: text('name').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        questionId: index("categories_questionId_index").on(t.questionId),
        questionIdUnique: unique("categories_questionId_unique").on(t.questionId),
    }),
);

export const categoriesRelations = relations(categories, ({ one }) => ({
    question: one(questions, {
        fields: [categories.questionId],
        references: [questions.id]
    }),
}))

export type Category = typeof categories.$inferSelect;

export const createCategorySchema = createInsertSchema(categories);
