ALTER TABLE "card_styles" RENAME TO "card_appearance";--> statement-breakpoint
ALTER TABLE "card_appearance" DROP CONSTRAINT "card_styles_card_id_cards_id_fk";
--> statement-breakpoint
DROP INDEX "card_styles_card_id_idx";--> statement-breakpoint
DROP INDEX "card_styles_card_id_unique_idx";--> statement-breakpoint
DROP INDEX "card_styles_template_idx";--> statement-breakpoint
DROP INDEX "card_styles_created_at_idx";--> statement-breakpoint
DROP INDEX "card_styles_deleted_at_idx";--> statement-breakpoint
ALTER TABLE "card_appearance" ADD CONSTRAINT "card_appearance_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appearance_card_id_idx" ON "card_appearance" USING btree ("card_id");--> statement-breakpoint
CREATE UNIQUE INDEX "appearance_card_id_unique_idx" ON "card_appearance" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "appearance_template_idx" ON "card_appearance" USING btree ("template");--> statement-breakpoint
CREATE INDEX "appearance_created_at_idx" ON "card_appearance" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "appearance_deleted_at_idx" ON "card_appearance" USING btree ("deleted_at");