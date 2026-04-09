import { Router } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable } from "@workspace/db";
import { SubmitContactFormBody } from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SubmitContactFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  const id = randomUUID();
  const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;

  await db.insert(contactSubmissionsTable).values({
    id,
    name: parsed.data.name,
    email: parsed.data.email,
    type: parsed.data.type,
    subject: parsed.data.subject,
    message: parsed.data.message,
    company: parsed.data.company,
  });

  res.json({
    success: true,
    ticketId,
    message: "Your inquiry has been received. We will respond within 1-2 business days.",
  });
});

export default router;
