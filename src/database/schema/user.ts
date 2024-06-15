/**
 * Drizzle example schema
 */
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    email: index("users_email_index").on(t.email),
  }),
);

export type User = typeof users.$inferSelect;

export const createUserSchema = createInsertSchema(users);
