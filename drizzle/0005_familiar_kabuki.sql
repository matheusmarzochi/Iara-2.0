CREATE TABLE IF NOT EXISTS "gptMessages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_type" text NOT NULL,
	"model_id" text NOT NULL,
	"model_name" text NOT NULL,
	"prompt" text NOT NULL,
	"output" text NOT NULL,
	"prompt_tokens" integer NOT NULL,
	"completion_tokens" integer NOT NULL,
	"total_tokens" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gptMessages_modelId_index" ON "gptMessages" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gptMessages_modelType_index" ON "gptMessages" USING btree ("model_type");