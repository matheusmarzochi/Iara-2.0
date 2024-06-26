ALTER TABLE "forms" ALTER COLUMN "research_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "research_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "researches" ALTER COLUMN "user_id" SET NOT NULL;