CREATE TABLE IF NOT EXISTS "todo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
