import { boolean, date, index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin", "dev"]);

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified")
			.$defaultFn(() => false)
			.notNull(),
		image: text("image"),
		role: rolesEnum("role").default("user").notNull(),
		banned: boolean("banned"),
		banReason: text("ban_reason"),
		banExpires: date("ban_expires_at"),
		twoFactorEnabled: boolean("two_factor_enabled"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [index("users_email_idx").on(table.email)]
);

export const sessions = pgTable(
	"sessions",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at").notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		impersonatedBy: text("impersonated_by"),
		activeOrganizationId: text("active_vendors_id"),
	},
	(table) => [index("sessions_user_id_idx").on(table.userId), index("sessions_token_idx").on(table.token)]
);

export const accounts = pgTable(
	"accounts",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at").notNull(),
	},
	(table) => [index("accounts_user_id_idx").on(table.userId)]
);

export const twoFactors = pgTable("two_factors", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	secret: text("secret").notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});
