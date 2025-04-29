DROP TABLE "analysis";--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "criteria" "analysis_criteria" NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "action" text NOT NULL;