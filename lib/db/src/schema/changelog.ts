import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const changelogTable = pgTable("changelog", {
  id: text("id").primaryKey(),
  version: text("version").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  date: timestamp("date").notNull(),
  links: jsonb("links").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChangelogSchema = createInsertSchema(changelogTable).omit({ createdAt: true });
export type InsertChangelog = z.infer<typeof insertChangelogSchema>;
export type ChangelogEntry = typeof changelogTable.$inferSelect;
