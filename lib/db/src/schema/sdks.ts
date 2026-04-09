import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sdksTable = pgTable("sdks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  language: text("language").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull().default("stable"),
  githubUrl: text("github_url"),
  npmUrl: text("npm_url"),
  docsUrl: text("docs_url"),
  weeklyDownloads: integer("weekly_downloads").notNull().default(0),
  icon: text("icon").notNull(),
  installCommand: text("install_command").notNull(),
  quickstartCode: text("quickstart_code").notNull(),
  features: text("features").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSdkSchema = createInsertSchema(sdksTable).omit({ createdAt: true });
export type InsertSdk = z.infer<typeof insertSdkSchema>;
export type Sdk = typeof sdksTable.$inferSelect;
