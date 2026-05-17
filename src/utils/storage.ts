import type { ChatMessage, GameState } from "../types";

const STORAGE_KEY = "ai-escape-room-session";

interface StoredMessage {
  id: string;
  role: ChatMessage["role"];
  content: string;
  timestamp: string;
  animate?: boolean;
}

interface StoredSession {
  game: GameState;
  messages: StoredMessage[];
}

export function loadSession(): {
  game: GameState | null;
  messages: ChatMessage[] | null;
} {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { game: null, messages: null };

    const parsed = JSON.parse(raw) as StoredSession;
    return {
      game: parsed.game,
      messages: parsed.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    };
  } catch {
    return { game: null, messages: null };
  }
}

export function saveSession(game: GameState, messages: ChatMessage[]): void {
  try {
    const payload: StoredSession = {
      game,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        animate: m.animate,
      })),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable — ignore
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
