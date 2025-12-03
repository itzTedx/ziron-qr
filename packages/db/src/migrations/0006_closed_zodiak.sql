DROP INDEX "workspace_preferences_idx";--> statement-breakpoint
CREATE INDEX "workspace_idx" ON "workspace" USING btree ("id");