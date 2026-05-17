import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  geminiChat,
  geminiHint,
  geminiLevelIntro,
  geminiStartGame,
} from "./gemini.ts";
import { applyGeminiResponse } from "./gameLogic.ts";
import type { HistoryMessage } from "./prompts.ts";
import type { GameState } from "../src/types/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === "production";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

function toHistory(
  messages: Array<{ role: string; content: string }>,
): HistoryMessage[] {
  return messages
    .filter((m) => ["user", "assistant", "system"].includes(m.role))
    .map((m) => ({
      role: m.role as HistoryMessage["role"],
      content: m.content,
    }));
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GOOGLE_API_KEY),
  });
});

app.post("/api/game/start", async (_req, res) => {
  try {
    const gemini = await geminiStartGame();
    res.json({
      intro: gemini.narrative,
      levelName: "The Neon Vault",
    });
  } catch (err) {
    console.error("[/api/game/start]", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to start game",
    });
  }
});

app.post("/api/game/level-intro", async (req, res) => {
  try {
    const game = req.body.game as GameState;
    const gemini = await geminiLevelIntro(game);
    res.json({ intro: gemini.narrative });
  } catch (err) {
    console.error("[/api/game/level-intro]", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to generate level intro",
    });
  }
});

app.post("/api/game/chat", async (req, res) => {
  try {
    const { message, game, messages } = req.body as {
      message: string;
      game: GameState;
      messages: Array<{ role: string; content: string }>;
    };

    if (!message?.trim() || !game) {
      res.status(400).json({ error: "message and game are required" });
      return;
    }

    const history = toHistory(messages ?? []);
    const gemini = await geminiChat(game, message.trim(), history);
    const result = applyGeminiResponse(gemini, game);

    res.json({
      ...result,
      nextLevelIntro:
        result.levelAdvanced && gemini.nextLevelIntro
          ? gemini.nextLevelIntro
          : result.nextLevelIntro,
    });
  } catch (err) {
    console.error("[/api/game/chat]", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to process message",
    });
  }
});

app.post("/api/game/hint", async (req, res) => {
  try {
    const { game, messages, hintTier } = req.body as {
      game: GameState;
      messages: Array<{ role: string; content: string }>;
      hintTier: number;
    };

    if (!game) {
      res.status(400).json({ error: "game is required" });
      return;
    }

    const history = toHistory(messages ?? []);
    const gemini = await geminiHint(game, history, hintTier ?? 0);

    res.json({ hint: gemini.narrative });
  } catch (err) {
    console.error("[/api/game/hint]", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to generate hint",
    });
  }
});

if (isProduction) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("Warning: GOOGLE_API_KEY is not set in .env");
  }
});
