import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";

export const gptMessages = pgTable(
    'gptMessages',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        model_type: text('model_type').notNull(),
        model_id: text('model_id').notNull(),
        model_name: text('model_name').notNull(),
        prompt: text('prompt').notNull(),
        output: text('output').notNull(),
        prompt_tokens: integer('prompt_tokens').notNull(),
        completion_tokens: integer('completion_tokens').notNull(),
        total_tokens: integer('total_tokens').notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        modelId: index("gptMessages_modelId_index").on(t.model_id),
        modelType: index("gptMessages_modelType_index").on(t.model_type),
    }),
);

export type GptMessages = typeof gptMessages.$inferSelect;

export const createGptMessageSchema = createInsertSchema(gptMessages);
