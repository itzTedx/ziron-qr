CREATE TYPE "public"."roles" AS ENUM('user', 'admin', 'dev');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "roles" DEFAULT 'user' NOT NULL,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires_at" date,
	"two_factor_enabled" boolean,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"phone" varchar(20),
	"website" varchar(255),
	"email" varchar(255),
	"address" text,
	"logo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100),
	"bio" text,
	"designation" varchar(255),
	"address" text,
	"map_url" varchar(500),
	"logo" text NOT NULL,
	"cover" text NOT NULL,
	"attachment_url" text,
	"attachment_file_name" varchar(255),
	"attachment_object_key" varchar(255),
	"company_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	CONSTRAINT "cards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"impersonated_by" text,
	"active_vendors_id" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "two_factors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_appearance" (
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
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"label" varchar(50) DEFAULT 'primary' NOT NULL,
	"order" real NOT NULL,
	"card_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"icon" varchar(100) NOT NULL,
	"category" varchar(100),
	"order" real NOT NULL,
	"card_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(20),
	"label" varchar(50) DEFAULT 'primary' NOT NULL,
	"order" real NOT NULL,
	"card_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
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
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_appearance" ADD CONSTRAINT "card_appearance_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_visits" ADD CONSTRAINT "page_visits_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_card_id_idx" ON "events" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "events_event_type_idx" ON "events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "events_card_id_event_type_idx" ON "events" USING btree ("card_id","event_type");--> statement-breakpoint
CREATE INDEX "events_card_id_created_at_idx" ON "events" USING btree ("card_id","created_at");--> statement-breakpoint
CREATE INDEX "page_visits_card_id_idx" ON "page_visits" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "page_visits_created_at_idx" ON "page_visits" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "page_visits_card_id_created_at_idx" ON "page_visits" USING btree ("card_id","created_at");--> statement-breakpoint
CREATE INDEX "appearance_card_id_idx" ON "card_appearance" USING btree ("card_id");--> statement-breakpoint
CREATE UNIQUE INDEX "appearance_card_id_unique_idx" ON "card_appearance" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "appearance_template_idx" ON "card_appearance" USING btree ("template");--> statement-breakpoint
CREATE INDEX "appearance_created_at_idx" ON "card_appearance" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "appearance_deleted_at_idx" ON "card_appearance" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "cards_name_idx" ON "cards" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cards_slug_idx" ON "cards" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cards_company_id_idx" ON "cards" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "cards_created_at_idx" ON "cards" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cards_deleted_at_idx" ON "cards" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "cards_archived_at_idx" ON "cards" USING btree ("archived_at");--> statement-breakpoint
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
CREATE UNIQUE INDEX "companies_slug_idx" ON "companies" USING btree ("slug");
