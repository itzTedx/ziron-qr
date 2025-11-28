ALTER TABLE "companies" RENAME TO "organization";--> statement-breakpoint
ALTER TABLE "cards" RENAME COLUMN "company_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "companies_slug_unique";--> statement-breakpoint
ALTER TABLE "cards" DROP CONSTRAINT "cards_company_id_companies_id_fk";
--> statement-breakpoint
DROP INDEX "cards_company_id_idx";--> statement-breakpoint
DROP INDEX "companies_name_idx";--> statement-breakpoint
DROP INDEX "companies_email_idx";--> statement-breakpoint
DROP INDEX "companies_created_at_idx";--> statement-breakpoint
DROP INDEX "companies_deleted_at_idx";--> statement-breakpoint
DROP INDEX "companies_slug_idx";--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cards_organization_id_idx" ON "cards" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_name_idx" ON "organization" USING btree ("name");--> statement-breakpoint
CREATE INDEX "organization_email_idx" ON "organization" USING btree ("email");--> statement-breakpoint
CREATE INDEX "organization_created_at_idx" ON "organization" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "organization_deleted_at_idx" ON "organization" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_idx" ON "organization" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_slug_unique" UNIQUE("slug");