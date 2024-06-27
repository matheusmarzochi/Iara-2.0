ALTER TABLE "answers" ALTER COLUMN "form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "researches" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;