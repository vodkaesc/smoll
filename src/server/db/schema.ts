import { pgTable, serial, varchar, timestamp,integer,text, pgEnum } from "drizzle-orm/pg-core"


// define user roles
export const userRoleEnum = pgEnum("user_role", ["user", "admin"])

//define user table
export const users = pgTable("users" , {
    id: varchar("id", { length: 255}).notNull().primaryKey(),
    name: varchar("name", {length: 255}),
    email: varchar("email", { length: 255}).notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode:  "date"}),
    image: text("image"),
    password: text("passwword"),
    role: userRoleEnum("role").default("user").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
export const urls = pgTable("urls", {
    id: serial("id").primaryKey(),
    originalUrl: varchar("original_url", {length: 2000}).notNull(),
    shortCode: varchar("short_code", {length: 10}).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    clicks: integer("clicks").default(0).notNull()
})