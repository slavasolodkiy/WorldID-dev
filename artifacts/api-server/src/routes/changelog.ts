import { Router } from "express";
import { db } from "@workspace/db";
import { changelogTable } from "@workspace/db";
import { GetChangelogQueryParams } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const parsed = GetChangelogQueryParams.safeParse(req.query);

  const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;
  const category = parsed.success ? parsed.data.category : undefined;

  let query = db.select().from(changelogTable).orderBy(desc(changelogTable.date)).$dynamic();

  if (category && category !== "all") {
    query = query.where(eq(changelogTable.category, category));
  }

  const entries = await query.limit(limit);
  res.json(entries);
});

export default router;
