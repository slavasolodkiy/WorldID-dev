import { Router } from "express";
import { db } from "@workspace/db";
import { docSectionsTable, docArticlesTable } from "@workspace/db";
import { GetDocSectionParams, SearchDocsQueryParams } from "@workspace/api-zod";
import { eq, like, or } from "drizzle-orm";

const router = Router();

router.get("/sections", async (req, res) => {
  const sections = await db
    .select()
    .from(docSectionsTable)
    .orderBy(docSectionsTable.order);
  res.json(sections);
});

router.get("/sections/:slug", async (req, res) => {
  const parsed = GetDocSectionParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  const section = await db
    .select()
    .from(docSectionsTable)
    .where(eq(docSectionsTable.slug, parsed.data.slug))
    .limit(1);

  if (!section[0]) {
    res.status(404).json({ error: "Section not found" });
    return;
  }

  const articles = await db
    .select()
    .from(docArticlesTable)
    .where(eq(docArticlesTable.sectionId, section[0].id));

  res.json({ ...section[0], articles });
});

router.get("/search", async (req, res) => {
  const parsed = SearchDocsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  const q = parsed.data.q;

  const articles = await db
    .select({
      id: docArticlesTable.id,
      title: docArticlesTable.title,
      description: docArticlesTable.description,
      slug: docArticlesTable.slug,
      sectionId: docArticlesTable.sectionId,
    })
    .from(docArticlesTable)
    .where(
      or(
        like(docArticlesTable.title, `%${q}%`),
        like(docArticlesTable.description, `%${q}%`),
        like(docArticlesTable.content, `%${q}%`)
      )
    )
    .limit(20);

  const sectionIds = [...new Set(articles.map((a) => a.sectionId))];
  const sections = sectionIds.length > 0
    ? await db
        .select({ id: docSectionsTable.id, title: docSectionsTable.title, slug: docSectionsTable.slug })
        .from(docSectionsTable)
    : [];

  const sectionMap = Object.fromEntries(sections.map((s) => [s.id, s]));

  const results = articles.map((article, idx) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    sectionTitle: sectionMap[article.sectionId]?.title ?? "Unknown",
    sectionSlug: sectionMap[article.sectionId]?.slug ?? "",
    slug: article.slug,
    relevance: 1 - idx * 0.05,
  }));

  res.json(results);
});

export default router;
