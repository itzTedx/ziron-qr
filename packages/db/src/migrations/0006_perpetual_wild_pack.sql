CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"map_url" text,
	"bio" text,
	"designation" text,
	"companyId" uuid NOT NULL,
	"attachmentUrl" text,
	"attachmentFileName" text,
	"logo" text NOT NULL,
	"cover" text NOT NULL,
	"slug" text,
	"template" text DEFAULT 'default' NOT NULL,
	"is_dark_mode" boolean DEFAULT false NOT NULL,
	"theme_color" text DEFAULT '#4938ff' NOT NULL,
	"button_color" text DEFAULT '#4938ff' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"cardId" uuid NOT NULL,
	"order" real NOT NULL,
	"label" text DEFAULT 'primary' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"icon" text NOT NULL,
	"cardId" uuid NOT NULL,
	"category" text,
	"order" real NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"id" uuid PRIMARY KEY NOT NULL,
	"phone" text,
	"cardId" uuid NOT NULL,
	"order" real NOT NULL,
	"label" text DEFAULT 'primary' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_cardId_cards_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_cardId_cards_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_cardId_cards_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;