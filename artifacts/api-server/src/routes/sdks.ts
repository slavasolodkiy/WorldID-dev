import { Router } from "express";
import { db } from "@workspace/db";
import { sdksTable, changelogTable } from "@workspace/db";
import { GetSdkParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const sdks = await db.select().from(sdksTable);
  res.json(sdks);
});

router.get("/:id", async (req, res) => {
  const parsed = GetSdkParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  const sdk = await db
    .select()
    .from(sdksTable)
    .where(eq(sdksTable.id, parsed.data.id))
    .limit(1);

  if (!sdk[0]) {
    res.status(404).json({ error: "SDK not found" });
    return;
  }

  const changelog = await db
    .select()
    .from(changelogTable)
    .where(eq(changelogTable.category, "sdk"))
    .limit(5);

  res.json({ ...sdk[0], changelog });
});

export default router;
