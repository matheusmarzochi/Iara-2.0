import { index, pgTable, json, unique, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { researches } from './research';

export const reports = pgTable(
    "reports",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        researchId: uuid('research_id').notNull().references(() => researches.id),
        data: json("data").notNull(),
        createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        researchId: index("reports_researchId_index").on(t.researchId),
        researchIdUnique: unique("reports_researchId_unique").on(t.researchId),
    }),
);

export type Report = typeof reports.$inferSelect;

export const createReportSchema = createInsertSchema(reports);
