CREATE TABLE IF NOT EXISTS "research_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"research_id" uuid NOT NULL,
	"session_id" text NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_views" ADD CONSTRAINT "research_views_research_id_researches_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."researches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "research_views_research_id_index" ON "research_views" USING btree ("research_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "research_views_research_id_session_id_index" ON "research_views" USING btree ("research_id","session_id");