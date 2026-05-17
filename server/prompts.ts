import { getLevel, MAX_LEVEL } from "../src/data/levels.ts";
import type { GameState } from "../src/types/index.ts";

export interface HistoryMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function formatHistory(messages: HistoryMessage[]): string {
  if (messages.length === 0) return "(No prior messages)";
  return messages
    .slice(-16)
    .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
    .join("\n");
}

function levelContext(level: number): string {
  const data = getLevel(level);
  return `Level ${level}/${MAX_LEVEL}: "${data.name}" — Theme: cyberpunk neon escape room. Bonus on solve: ${data.levelCompleteBonus} pts.`;
}

export function buildNarratorSystemPrompt(game: GameState): string {
  return `You are the AI Narrator of "Neon Vault", a cinematic cyberpunk escape room experience.

ROLE:
- Speak in second person ("you see...", "the terminal hums...")
- Be atmospheric, tense, and concise (2-5 sentences unless the moment demands more)
- Invent vivid sensory details: neon light, static, holograms, locked doors, hidden codes
- Create ONE clear solvable puzzle per level that players can crack via chat (codes, symbols, riddles, items)
- Track story continuity — reference what the player already did and discovered
- Never break character. Never mention being an AI model or JSON
- Use **bold** sparingly for important objects/clues

GAME RULES YOU MUST ENFORCE:
- Current level: ${game.level} of ${MAX_LEVEL}
- ${levelContext(game.level)}
- When the player genuinely solves the current level puzzle, set puzzleSolved: true
- Only set gameWon: true when level is ${MAX_LEVEL} AND they complete the final escape
- If the attempt is wrong or unclear, puzzleSolved: false and react in-character
- Hints must NOT give the full answer — escalate subtlety based on hintTier (0=vague, 1=clearer, 2=strong nudge)

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences:
{
  "narrative": "your in-character narrator response",
  "puzzleSolved": boolean,
  "gameWon": boolean,
  "nextLevelIntro": "only when puzzleSolved true AND gameWon false — describe the NEW room they enter for the next level"
}`;
}

export function buildChatUserPrompt(
  game: GameState,
  userMessage: string,
  history: HistoryMessage[],
): string {
  return `GAME STATE:
- Level: ${game.level} (${game.levelName})
- Score: ${game.score}
- Hints used: ${game.hintsUsed}, remaining: ${game.hintsRemaining}
- Elapsed: ${game.elapsedSeconds}s

CONVERSATION HISTORY:
${formatHistory(history)}

PLAYER ACTION:
${userMessage}

Respond as the narrator. Decide if they solved the level puzzle.`;
}

export function buildHintUserPrompt(
  game: GameState,
  history: HistoryMessage[],
  hintTier: number,
): string {
  return `GAME STATE:
- Level: ${game.level} (${game.levelName})
- Hint tier: ${hintTier} (0=subtle, 1=medium, 2=strong but not full solution)

CONVERSATION HISTORY:
${formatHistory(history)}

Generate a hint for the player's CURRENT unsolved puzzle. Return JSON:
{
  "narrative": "the hint text prefixed with a clue emoji is fine",
  "puzzleSolved": false,
  "gameWon": false,
  "nextLevelIntro": ""
}`;
}

export function buildLevelIntroPrompt(game: GameState): string {
  return `GAME STATE:
- Starting level: ${game.level}
- ${levelContext(game.level)}

Generate the OPENING scene for this level — describe the room, the main puzzle, and end with an inviting question.
Return JSON:
{
  "narrative": "opening scene text",
  "puzzleSolved": false,
  "gameWon": false,
  "nextLevelIntro": ""
}`;
}

export function buildStartGamePrompt(): string {
  return `The player just hit START. Generate level 1 opening for "${getLevel(1).name}".
Introduce the Neon Vault cyberpunk escape room, describe the first chamber and puzzle, end with a question.
Return JSON with narrative only (puzzleSolved and gameWon false, nextLevelIntro empty).`;
}
