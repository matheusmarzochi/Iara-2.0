DO $$ BEGIN
 CREATE TYPE "public"."researches_status" AS ENUM('CREATED', 'PROCESSING', 'FINISHED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "researches" ADD COLUMN "status" "researches_status" DEFAULT 'CREATED' NOT NULL;--> statement-breakpoint
ALTER TABLE "researches" ADD COLUMN "updated_at" timestamp with time zone;