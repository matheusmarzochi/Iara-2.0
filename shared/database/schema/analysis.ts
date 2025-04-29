import { index, pgEnum, pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { categories } from './category';

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
        categoryId: uuid('category_id').notNull().references(() => categories.id),
        criteria: analysisCriteria("criteria").notNull(),
        action: text('action').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        categoryId: index("analysis_categoryId_index").on(t.categoryId),
        categoryIdCriteriaUnique: unique("analysis_categoryId_criteria_unique").on(t.categoryId, t.criteria),
    }),
);

export const analysisRelations = relations(analysis, ({ one }) => ({
    category: one(categories, {
        fields: [analysis.categoryId],
        references: [categories.id]
    }),
}))

export type Analysis = typeof analysis.$inferSelect;

export const createAnalysisSchema = createInsertSchema(analysis);
