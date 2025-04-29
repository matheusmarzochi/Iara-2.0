CREATE TABLE IF NOT EXISTS "analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"criteria" "analysis_criteria" NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_categoryId_criteria_unique" UNIQUE("category_id","criteria")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analysis" ADD CONSTRAINT "analysis_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analysis_categoryId_index" ON "analysis" USING btree ("category_id");--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "criteria";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "action";