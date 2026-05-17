export interface LevelDefinition {
  id: number;
  name: string;
  hints: string[];
  solveKeywords: string[];
  levelCompleteBonus: number;
  scenario: string;
  wrongResponses: string[];
  solvedResponses: string[];
}

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: "The Neon Vault",
    scenario:
      "The room hums with electric blue light. A locked terminal glows on the far wall, and three symbols are etched into the floor: **△ ○ ✕**. The terminal awaits input. What do you do?",
    hints: [
      "Look at the floor symbols — the terminal wants them **in order**, from left to right.",
      "Try typing the symbol names: **triangle**, then **circle**, then **x**.",
      "Enter exactly: **triangle circle x** (or use the symbols △ ○ ✕).",
    ],
    solveKeywords: [
      "triangle circle x",
      "triangle, circle, x",
      "△ ○ ✕",
      "△○✕",
      "delta circle cross",
    ],
    levelCompleteBonus: 150,
    wrongResponses: [
      "The terminal flashes red. That sequence isn't recognized. Study the symbols on the floor again.",
      "Nothing happens. Perhaps the vault wants a specific order of symbols?",
      "A low buzz echoes — wrong input. The etchings on the floor might be a clue.",
    ],
    solvedResponses: [
      "The terminal accepts your input! A hidden panel slides open, revealing a corridor bathed in magenta light. You step through...",
    ],
  },
  {
    id: 2,
    name: "The Signal Room",
    scenario:
      "Static fills the air. A radio transmitter blinks beside a frequency dial locked at **????**. A note reads: *\"The code is spoken in the static: seven, three, five, one.\"* What do you do?",
    hints: [
      "Read the note carefully — it spells out digits verbally.",
      "The frequency code is four numbers spoken aloud in the note.",
      "Enter the code **7351** into the transmitter or say it in chat.",
    ],
    solveKeywords: ["7351", "7 3 5 1", "seven three five one", "frequency 7351"],
    levelCompleteBonus: 200,
    wrongResponses: [
      "The dial sputters — that's not the right frequency. Listen to the static again.",
      "Only static answers. The note on the table might hold the key.",
      "The transmitter rejects your input. Four digits, spoken in the note...",
    ],
    solvedResponses: [
      "The dial locks onto 7351! The static clears, and a service elevator descends. You board it, descending deeper...",
    ],
  },
  {
    id: 3,
    name: "The Final Lock",
    scenario:
      "The elevator opens to a bare chamber. One door, no handle — only a voice panel. A calm synthetic voice says: *\"Authorization required. State your intention to leave.\"* What do you do?",
    hints: [
      "The voice panel wants to know you intend to **leave**.",
      "Try words like **escape**, **exit**, or **open the door**.",
      "Say clearly that you want to **escape** the facility.",
    ],
    solveKeywords: [
      "escape",
      "i want to escape",
      "let me out",
      "open the door",
      "exit",
      "leave",
      "authorize exit",
    ],
    levelCompleteBonus: 300,
    wrongResponses: [
      "Access denied. The voice repeats: \"State your intention to leave.\"",
      "The panel pulses red. Perhaps be more direct about wanting to escape?",
      "No response. The chamber feels colder. What would you say to get out?",
    ],
    solvedResponses: [
      "Authorization granted. The door irises open, flooding the room with daylight. You step into freedom — **you've escaped!**",
    ],
  },
];

export const MAX_LEVEL = LEVELS.length;

export function getLevel(levelId: number): LevelDefinition {
  return LEVELS[levelId - 1] ?? LEVELS[LEVELS.length - 1];
}
