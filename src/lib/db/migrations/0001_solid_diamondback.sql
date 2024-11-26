ALTER TABLE "projects" ALTER COLUMN "name" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" varchar(400);