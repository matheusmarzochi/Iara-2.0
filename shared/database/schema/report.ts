import { index, pgTable, json, unique, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { researches } from './research';


export type ScoreBox = {
    fit: number;
    neutral: number;
    unfit: number;
};

export type StrategyKeys =
    | "improve"
    | "adjust"
    | "develop"
    | "focus"
    | "pivot"
    | "abandon";

export type StrategyInsights = Record<StrategyKeys, string[]>

export type ReportAwnser = {
    id: string;
    purpose: string;
    score: number;
    sequence: number;
    explanation: string;
    classifications: Array<{
        affinities: Array<number>;
        names: Array<string>;
    }>;
}

export type PointOfInterest = {
    name: string;
    score_box: ScoreBox;
    answers: ReportAwnser[]
}

export type ReportData = {
    question_id: string;
    question_propose: string;
    score_box: ScoreBox;
    point_of_interests: PointOfInterest[]
    strategy_insights: StrategyInsights;
    total_forms: number;
}


export const reports = pgTable(
    "reports",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        researchId: uuid('research_id').notNull().references(() => researches.id),
        data: json("data").$type<ReportData[]>().notNull(),
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
