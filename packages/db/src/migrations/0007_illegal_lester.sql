ALTER TABLE "cards" RENAME COLUMN "attachmentUrl" TO "attachment_url";--> statement-breakpoint
ALTER TABLE "cards" RENAME COLUMN "attachmentFileName" TO "attachment_file_name";--> statement-breakpoint
ALTER TABLE "cards" RENAME COLUMN "companyId" TO "company_id";--> statement-breakpoint
ALTER TABLE "cards" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "emails" RENAME COLUMN "cardId" TO "card_id";--> statement-breakpoint
ALTER TABLE "emails" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "links" RENAME COLUMN "cardId" TO "card_id";--> statement-breakpoint
ALTER TABLE "links" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "phones" RENAME COLUMN "cardId" TO "card_id";--> statement-breakpoint
ALTER TABLE "phones" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "companies" RENAME COLUMN "createdAt" TO "slug";--> statement-breakpoint
ALTER TABLE "companies" RENAME COLUMN "deletedAt" TO "email";--> statement-breakpoint
ALTER TABLE "cards" DROP CONSTRAINT "cards_companyId_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "emails" DROP CONSTRAINT "emails_cardId_cards_id_fk";
--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_cardId_cards_id_fk";
--> statement-breakpoint
ALTER TABLE "phones" DROP CONSTRAINT "phones_cardId_cards_id_fk";
--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "map_url" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "designation" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "slug" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "template" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "template" SET DEFAULT 'default';--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "theme_color" SET DATA TYPE varchar(7);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "theme_color" SET DEFAULT '#4938ff';--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "button_color" SET DATA TYPE varchar(7);--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "button_color" SET DEFAULT '#4938ff';--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "label" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "label" SET DEFAULT 'primary';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "url" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "icon" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "category" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "phones" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "phones" ALTER COLUMN "phone" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "phones" ALTER COLUMN "label" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "phones" ALTER COLUMN "label" SET DEFAULT 'primary';--> statement-breakpoint
ALTER TABLE "phones" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "phones" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "phone" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "website" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "phones" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cards_name_idx" ON "cards" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cards_slug_idx" ON "cards" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cards_company_id_idx" ON "cards" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "cards_template_idx" ON "cards" USING btree ("template");--> statement-breakpoint
CREATE INDEX "cards_created_at_idx" ON "cards" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cards_deleted_at_idx" ON "cards" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cards_slug_unique_idx" ON "cards" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "emails_card_id_idx" ON "emails" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "emails_order_idx" ON "emails" USING btree ("order");--> statement-breakpoint
CREATE INDEX "emails_created_at_idx" ON "emails" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "emails_deleted_at_idx" ON "emails" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "links_card_id_idx" ON "links" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "links_category_idx" ON "links" USING btree ("category");--> statement-breakpoint
CREATE INDEX "links_order_idx" ON "links" USING btree ("order");--> statement-breakpoint
CREATE INDEX "links_created_at_idx" ON "links" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "links_deleted_at_idx" ON "links" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "phones_card_id_idx" ON "phones" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "phones_order_idx" ON "phones" USING btree ("order");--> statement-breakpoint
CREATE INDEX "phones_created_at_idx" ON "phones" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "phones_deleted_at_idx" ON "phones" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "companies_name_idx" ON "companies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "companies_email_idx" ON "companies" USING btree ("email");--> statement-breakpoint
CREATE INDEX "companies_created_at_idx" ON "companies" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "companies_deleted_at_idx" ON "companies" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_slug_idx" ON "companies" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_slug_unique" UNIQUE("slug");