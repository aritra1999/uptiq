CREATE TABLE IF NOT EXISTS "alert_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alert_id" uuid NOT NULL,
	"website_id" uuid NOT NULL,
	"status" "status_enum" NOT NULL,
	"sent" boolean DEFAULT false NOT NULL,
	"error" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert_logs" ADD CONSTRAINT "alert_logs_alert_id_alerts_id_fk" FOREIGN KEY ("alert_id") REFERENCES "public"."alerts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert_logs" ADD CONSTRAINT "alert_logs_website_id_websites_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."websites"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
