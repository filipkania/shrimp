import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: int("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	salt: text("salt").notNull(),
});
