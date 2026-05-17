export type MessageRole = "user" | "assistant" | "system";

export type GameStatus = "idle" | "playing" | "won";

export type GameFeedback = "none" | "wrong" | "success" | "levelUp" | "win";

export type MessageTone = "default" | "danger" | "success";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** When true, assistant text reveals with a typewriter effect */
  animate?: boolean;
  tone?: MessageTone;
}

export interface GameState {
  isPlaying: boolean;
  status: GameStatus;
  score: number;
  level: number;
  levelName: string;
  hintsUsed: number;
  hintsRemaining: number;
  /** Index into current level's hint list */
  levelHintIndex: number;
  elapsedSeconds: number;
}

export const INITIAL_GAME_STATE: GameState = {
  isPlaying: false,
  status: "idle",
  score: 0,
  level: 1,
  levelName: "The Neon Vault",
  hintsUsed: 0,
  hintsRemaining: 3,
  levelHintIndex: 0,
  elapsedSeconds: 0,
};
