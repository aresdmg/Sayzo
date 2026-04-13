import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"),
    avatar: text("avatar_url").default(""),
    role: varchar("role", { length: 5 }).$type<"USER" | "ADMIN">().default("USER").notNull()
})