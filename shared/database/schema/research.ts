import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";
import { questions, type Question } from "./question";
import { forms, type Form } from "./form";
import { reports, Report } from "./report";

export const researchesStatus = pgEnum("researches_status", [
  "CREATED",
  "PROCESSING",
  "FINISHED",
]);

export const researches = pgTable(
  "researches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: researchesStatus("status").default("CREATED").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (t) => ({
    userId: index("researches_userId_index").on(t.userId),
  }),
);

export const researchesRelations = relations(researches, ({ many }) => ({
  questions: many(questions),
  forms: many(forms),
}));

export type Research = typeof researches.$inferSelect & {
  forms: Form[];
  questions: Question[];
};

export const createResearchSchema = createInsertSchema(researches);
