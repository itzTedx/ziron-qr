CREATE TABLE "card_styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"template" varchar(50) DEFAULT 'default' NOT NULL,
	"is_dark_mode" boolean DEFAULT false NOT NULL,
	"theme_color" varchar(7) DEFAULT '#4938ff' NOT NULL,
	"button_color" varchar(7) DEFAULT '#4938ff' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DROP INDEX "cards_template_idx";--> statement-breakpoint
ALTER TABLE "card_styles" ADD CONSTRAINT "card_styles_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "card_styles_card_id_idx" ON "card_styles" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "card_styles_template_idx" ON "card_styles" USING btree ("template");--> statement-breakpoint
CREATE INDEX "card_styles_created_at_idx" ON "card_styles" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "card_styles_deleted_at_idx" ON "card_styles" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN "template";--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN "is_dark_mode";--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN "theme_color";--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN "button_color";