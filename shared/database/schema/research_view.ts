import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { researches } from "./research"

export const researchViews = pgTable(
    "research_views",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        researchId: uuid("research_id")
            .notNull()
            .references(() => researches.id, { onDelete: "cascade" }),
        sessionId: text("session_id").notNull(),
        viewedAt: timestamp("viewed_at", { mode: "date", withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        researchIdIndex: index("research_views_research_id_index").on(t.researchId),
        researchIdSessionIdIndex: index("research_views_research_id_session_id_index").on(t.researchId, t.sessionId),
        researchIdSessionIdUnique: unique("research_views_research_id_session_id_unique").on(t.researchId, t.sessionId),
    }),
);

export type ResearchView = typeof researchViews.$inferSelect;
export const createResearchViewSchema = createInsertSchema(researchViews);