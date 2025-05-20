import {
    json,
    pgTable,
    text,
    timestamp,
    uuid,
    index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";

export type ResearchesList = string[];

export const fitness = pgTable(
    "fitness",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
        researches: json("researches").$type<ResearchesList>().notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }),
        deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
    },
    (t) => ({
        userId: index("fitness_userId_index").on(t.userId),
    }),
);

export type Fitness = typeof fitness.$inferSelect & {};

export const createFitnessSchema = createInsertSchema(fitness);
