CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_name" varchar(255),
	"metadata" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"device_type" varchar(50),
	"browser" varchar(100),
	"os" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"referer" text,
	"country" varchar(2),
	"city" varchar(255),
	"device_type" varchar(50),
	"browser" varchar(100),
	"os" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_visits" ADD CONSTRAINT "page_visits_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_card_id_idx" ON "events" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "events_event_type_idx" ON "events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "events_card_id_event_type_idx" ON "events" USING btree ("card_id","event_type");--> statement-breakpoint
CREATE INDEX "events_card_id_created_at_idx" ON "events" USING btree ("card_id","created_at");--> statement-breakpoint
CREATE INDEX "page_visits_card_id_idx" ON "page_visits" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "page_visits_created_at_idx" ON "page_visits" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "page_visits_card_id_created_at_idx" ON "page_visits" USING btree ("card_id","created_at");