import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import {
  CreatePostBody,
  CreatePostResponse,
  DeletePostParams,
  DeletePostResponse,
  ListPostsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/posts", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.timestamp));
  res.json(ListPostsResponse.parse(posts));
});

router.post("/posts", async (req, res): Promise<void> => {
  if (!req.session.loggedIn) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db
    .insert(postsTable)
    .values({
      text: parsed.data.text,
      photoUrl: parsed.data.photoUrl ?? null,
      timestamp: Date.now(),
    })
    .returning();

  res.status(201).json(CreatePostResponse.parse(post));
});

router.delete("/posts/:id", async (req, res): Promise<void> => {
  if (!req.session.loggedIn) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeletePostParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(postsTable)
    .where(eq(postsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(DeletePostResponse.parse({ success: true }));
});

export default router;
