import { auth } from "@News-Monkey/auth";
import { env } from "@News-Monkey/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import prisma from "@News-Monkey/db";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Typing Results API
app.post("/api/typing/results", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });

  const {
    articleTitle,
    articleSource,
    articleUrl,
    wpm,
    accuracy,
    errors,
    totalCharsTyped,
    category,
    publishedAt
  } = req.body;

  try {
    const result = await prisma.typingResult.create({
      data: {
        userId: session?.user?.id || null,
        articleTitle,
        articleSource,
        articleUrl,
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy),
        errors,
        totalCharsTyped,
        category,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      }
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error saving typing result:", error);
    res.status(500).json({ error: "Failed to save result" });
  }
});

app.get("/api/typing/results", async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const results = await prisma.typingResult.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
