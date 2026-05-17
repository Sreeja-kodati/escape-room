import { getLevel, MAX_LEVEL } from "../data/levels";
import type { ChatMessage, GameState, MessageTone } from "../types";

export interface EngineResult {
  assistantContent: string;
  systemContent?: string;
  gameUpdates: Partial<GameState>;
  levelAdvanced: boolean;
  gameWon: boolean;
  wasWrongAnswer?: boolean;
  /** Gemini-generated intro for the next level (when advancing) */
  nextLevelIntro?: string;
}

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchesSolve(input: string, keywords: string[]): boolean {
  const normalized = normalize(input);
  return keywords.some((kw) => normalized.includes(normalize(kw)));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getHintForLevel(level: number, hintIndex: number): string {
  const levelData = getLevel(level);
  const index = Math.min(hintIndex, levelData.hints.length - 1);
  return levelData.hints[index];
}

export function processUserMessage(
  userInput: string,
  game: GameState,
): EngineResult {
  const levelData = getLevel(game.level);
  const solved = matchesSolve(userInput, levelData.solveKeywords);

  if (solved) {
    const isLastLevel = game.level >= MAX_LEVEL;

    if (isLastLevel) {
      return {
        assistantContent: pickRandom(levelData.solvedResponses),
        systemContent: "🎉 **MISSION COMPLETE** — You escaped the Neon Vault! Final score locked.",
        gameUpdates: {
          score: game.score + levelData.levelCompleteBonus,
          status: "won",
          isPlaying: false,
        },
        levelAdvanced: false,
        gameWon: true,
      };
    }

    const nextLevel = game.level + 1;
    const nextLevelData = getLevel(nextLevel);

    return {
      assistantContent: pickRandom(levelData.solvedResponses),
      systemContent: `— Level ${game.level} cleared! Advancing to Level ${nextLevel}: ${nextLevelData.name} —`,
      gameUpdates: {
        score: game.score + levelData.levelCompleteBonus + 25,
        level: nextLevel,
        levelName: nextLevelData.name,
        levelHintIndex: 0,
      },
      levelAdvanced: true,
      gameWon: false,
    };
  }

  return {
    assistantContent: pickRandom(levelData.wrongResponses),
    gameUpdates: {
      score: Math.max(0, game.score - 5),
    },
    levelAdvanced: false,
    gameWon: false,
    wasWrongAnswer: true,
  };
}

export function getLevelIntroMessage(level: number): ChatMessage {
  const levelData = getLevel(level);
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: levelData.scenario,
    timestamp: new Date(),
    animate: true,
  };
}

export function createSystemMessage(content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "system",
    content,
    timestamp: new Date(),
  };
}

export function createAssistantMessage(
  content: string,
  animate = true,
  tone: MessageTone = "default",
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    timestamp: new Date(),
    animate,
    tone,
  };
}
