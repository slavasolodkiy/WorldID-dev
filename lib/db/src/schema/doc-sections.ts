import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const docSectionsTable = pgTable("doc_sections", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  articleCount: integer("article_count").notNull().default(0),
  category: text("category").notNull(),
  status: text("status").notNull().default("stable"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDocSectionSchema = createInsertSchema(docSectionsTable).omit({ createdAt: true });
export type InsertDocSection = z.infer<typeof insertDocSectionSchema>;
export type DocSection = typeof docSectionsTable.$inferSelect;

export const docArticlesTable = pgTable("doc_articles", {
  id: text("id").primaryKey(),
  sectionId: text("section_id").notNull().references(() => docSectionsTable.id),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("stable"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  estimatedReadTime: integer("estimated_read_time").notNull().default(5),
  tags: text("tags").array().notNull().default([]),
});

export const insertDocArticleSchema = createInsertSchema(docArticlesTable).omit({ lastUpdated: true });
export type InsertDocArticle = z.infer<typeof insertDocArticleSchema>;
export type DocArticle = typeof docArticlesTable.$inferSelect;
