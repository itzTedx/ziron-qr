ALTER TABLE "cards" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "cards_archived_at_idx" ON "cards" USING btree ("archived_at");