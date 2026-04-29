import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"),
    avatar: text("avatar_url").default("https://res.cloudinary.com/desamhhkj/image/upload/v1774217400/avatar0_jntvgv.jpg").notNull(),
    role: varchar("role", { length: 5 }).$type<"USER" | "ADMIN">().default("USER").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
})

export const userToken = pgTable("user_tokens", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
    revoked: boolean("revoked").default(false).notNull(),
    expiredAt: timestamp("expired_at", { withTimezone: true, mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
})

export const businesses = pgTable("businesses", {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    reviewLink: text("review_link"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
})

export const reviews = pgTable("reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
    rating: integer("rating").notNull(),
    content: text("content").notNull(),
    fingerprint: text("fingerprint").notNull(),
    language: varchar("language", { length: 2 }).$type<"en" | "hi">().default("en").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
})

export const audioReviews = pgTable("audio_reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewId: uuid("id").references(() => reviews.id, { onDelete: "cascade" }).notNull(),
    audioUrl: text("audio_url").notNull(),
    duration: integer("duration").notNull(),
    transcript: text("transcript").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
})