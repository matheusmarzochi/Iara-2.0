import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";
import { users } from './user'

export const researches = pgTable(
    'researches',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        title: text('title').notNull(),
        description: text('description').notNull(),
        userId: uuid('user_id').references(() => users.id),
    },
    (t) => ({
        userId: index("researches_userId_index").on(t.userId),
    }),
);

export type Research = typeof researches.$inferSelect;

export const createResearchSchema = createInsertSchema(researches);
