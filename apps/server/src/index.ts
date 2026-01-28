import { auth } from "@News-Monkey/auth";
import { env } from "@News-Monkey/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import { NewsService } from "./services/news.service";
import rateLimit from "express-rate-limit";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Rate limiting for APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// News API (Direct Fetch)
app.get("/api/news", apiLimiter, async (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'general';
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const articles = await NewsService.getNews(category, limit);
    // console.log(articles)
    res.json(articles);
  } catch (error) {
    console.error("News API Error:", error);
    res.status(500).json({ error: "Failed to fetch live news" });
  }
});

app.get("/api/news/status", async (_req: Request, res: Response) => {
  try {
    const status = await NewsService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to get status" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
