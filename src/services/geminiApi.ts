import type { ChatMessage, GameState } from "../types";
import type { EngineResult } from "./gameEngine";

const API_BASE = "/api";

export class GeminiApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "GeminiApiError";
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
  } & T;

  if (!res.ok) {
    throw new GeminiApiError(data.error ?? `Request failed (${res.status})`, res.status);
  }

  return data;
}

export function toApiHistory(messages: ChatMessage[]) {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export async function fetchGameStart(): Promise<{
  intro: string;
  levelName: string;
}> {
  return post("/game/start", {});
}

export async function fetchChat(
  message: string,
  game: GameState,
  messages: ChatMessage[],
): Promise<EngineResult> {
  return post<EngineResult>("/game/chat", {
    message,
    game,
    messages: toApiHistory(messages),
  });
}

export async function fetchHint(
  game: GameState,
  messages: ChatMessage[],
  hintTier: number,
): Promise<{ hint: string }> {
  return post<{ hint: string }>("/game/hint", {
    game,
    messages: toApiHistory(messages),
    hintTier,
  });
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = (await res.json()) as { geminiConfigured?: boolean };
    return res.ok && Boolean(data.geminiConfigured);
  } catch {
    return false;
  }
}
