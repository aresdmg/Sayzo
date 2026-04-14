import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

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
    expiredAt: timestamp("expired_at", { withTimezone: true, mode: "date" }).notNull(),
    revoked: boolean("revoked").default(false).notNull()
})