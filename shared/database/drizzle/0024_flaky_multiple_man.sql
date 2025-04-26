CREATE TYPE "public"."analysis_criteria" AS ENUM('PIVOT', 'IMPROVE', 'MAINTAIN', 'ABANDON', 'FOCUS', 'RETHINK');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"criteria" "analysis_criteria" NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_questionId_unique" UNIQUE("question_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analysis" ADD CONSTRAINT "analysis_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analysis_questionId_index" ON "analysis" USING btree ("question_id");