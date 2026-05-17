import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GameState } from "../src/types/index.ts";
import {
  buildChatUserPrompt,
  buildHintUserPrompt,
  buildLevelIntroPrompt,
  buildNarratorSystemPrompt,
  buildStartGamePrompt,
  type HistoryMessage,
} from "./prompts.js";

export interface GeminiNarrativeResponse {
  narrative: string;
  puzzleSolved: boolean;
  gameWon: boolean;
  nextLevelIntro?: string;
}

const MODEL = "gemini-2.0-flash";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set. Add it to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel(systemInstruction: string) {
  return getClient().getGenerativeModel({
    model: MODEL,
    systemInstruction,
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    },
  });
}

function parseGeminiJson(text: string): GeminiNarrativeResponse {
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleaned) as GeminiNarrativeResponse;

  if (!parsed.narrative || typeof parsed.narrative !== "string") {
    throw new Error("Invalid Gemini response: missing narrative");
  }

  return {
    narrative: parsed.narrative.trim(),
    puzzleSolved: Boolean(parsed.puzzleSolved),
    gameWon: Boolean(parsed.gameWon),
    nextLevelIntro: parsed.nextLevelIntro?.trim() || "",
  };
}

async function generate(
  systemPrompt: string,
  userPrompt: string,
): Promise<GeminiNarrativeResponse> {
  const model = getModel(systemPrompt);
  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return parseGeminiJson(text);
}

export async function geminiChat(
  game: GameState,
  userMessage: string,
  history: HistoryMessage[],
): Promise<GeminiNarrativeResponse> {
  return generate(
    buildNarratorSystemPrompt(game),
    buildChatUserPrompt(game, userMessage, history),
  );
}

export async function geminiHint(
  game: GameState,
  history: HistoryMessage[],
  hintTier: number,
): Promise<GeminiNarrativeResponse> {
  return generate(
    buildNarratorSystemPrompt(game),
    buildHintUserPrompt(game, history, hintTier),
  );
}

export async function geminiLevelIntro(
  game: GameState,
): Promise<GeminiNarrativeResponse> {
  return generate(
    buildNarratorSystemPrompt(game),
    buildLevelIntroPrompt(game),
  );
}

export async function geminiStartGame(): Promise<GeminiNarrativeResponse> {
  const game: GameState = {
    isPlaying: true,
    status: "playing",
    score: 100,
    level: 1,
    levelName: "The Neon Vault",
    hintsUsed: 0,
    hintsRemaining: 3,
    levelHintIndex: 0,
    elapsedSeconds: 0,
  };

  return generate(buildNarratorSystemPrompt(game), buildStartGamePrompt());
}
