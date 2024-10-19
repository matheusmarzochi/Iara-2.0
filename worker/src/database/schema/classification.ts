import { index, integer, pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { answers } from './answer';

export const classifications = pgTable(
    'classifications',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        answerId: uuid('answer_id').notNull().references(() => answers.id),
        names: text('names').array().notNull(),
        affinities: integer('affinities').array().notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        answerId: index("classifications_answerId_index").on(t.answerId),
        answerIdUnique: unique("classifications_answerId_unique").on(t.answerId),
    }),
);

export const classificationsRelations = relations(classifications, ({ one }) => ({
    answer: one(answers, {
        fields: [classifications.answerId],
        references: [answers.id]
    }),
}))

export type Classification = typeof classifications.$inferSelect;

export const createClassificationSchema = createInsertSchema(classifications);
