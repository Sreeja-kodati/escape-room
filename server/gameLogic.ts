import { getLevel, MAX_LEVEL } from "../src/data/levels.ts";
import type { EngineResult } from "../src/services/gameEngine.ts";
import type { GameState } from "../src/types/index.ts";
import type { GeminiNarrativeResponse } from "./gemini.ts";

export function applyGeminiResponse(
  gemini: GeminiNarrativeResponse,
  game: GameState,
): EngineResult {
  const levelData = getLevel(game.level);

  if (gemini.gameWon && game.level >= MAX_LEVEL && gemini.puzzleSolved) {
    return {
      assistantContent: gemini.narrative,
      systemContent:
        "🎉 **MISSION COMPLETE** — You escaped the Neon Vault! Final score locked.",
      gameUpdates: {
        score: game.score + levelData.levelCompleteBonus,
        status: "won",
        isPlaying: false,
      },
      levelAdvanced: false,
      gameWon: true,
    };
  }

  if (gemini.puzzleSolved && game.level < MAX_LEVEL) {
    const nextLevel = game.level + 1;
    const nextLevelData = getLevel(nextLevel);

    return {
      assistantContent: gemini.narrative,
      systemContent: `— Level ${game.level} cleared! Advancing to Level ${nextLevel}: ${nextLevelData.name} —`,
      gameUpdates: {
        score: game.score + levelData.levelCompleteBonus + 25,
        level: nextLevel,
        levelName: nextLevelData.name,
        levelHintIndex: 0,
      },
      levelAdvanced: true,
      gameWon: false,
      nextLevelIntro: gemini.nextLevelIntro || "",
    };
  }

  if (gemini.puzzleSolved && game.level >= MAX_LEVEL) {
    return {
      assistantContent: gemini.narrative,
      systemContent:
        "🎉 **MISSION COMPLETE** — You escaped the Neon Vault! Final score locked.",
      gameUpdates: {
        score: game.score + levelData.levelCompleteBonus,
        status: "won",
        isPlaying: false,
      },
      levelAdvanced: false,
      gameWon: true,
    };
  }

  return {
    assistantContent: gemini.narrative,
    gameUpdates: {
      score: Math.max(0, game.score - 5),
    },
    levelAdvanced: false,
    gameWon: false,
  };
}
