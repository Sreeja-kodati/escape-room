import { useCallback, useEffect, useRef, useState } from "react";
import { getLevel } from "../data/levels";
import {
  createAssistantMessage,
  createSystemMessage,
  getHintForLevel,
  getLevelIntroMessage,
  processUserMessage,
} from "../services/gameEngine";
import type { EngineResult } from "../services/gameEngine";
import {
  fetchChat,
  fetchGameStart,
  fetchHint,
} from "../services/geminiApi";
import type { ChatMessage, GameFeedback, GameState } from "../types";
import { INITIAL_GAME_STATE } from "../types";
import { clearSession, loadSession, saveSession } from "../utils/storage";

const HINT_PENALTY = 25;
const MESSAGE_BONUS = 10;

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Welcome, operative. You are locked in the Neon Vault — a digital chamber where only your wits can set you free. When you're ready, hit **Start Game** and describe what you see. I'll be your guide through the darkness.",
    timestamp: new Date(),
    animate: false,
  },
];

function createInitialMessages(): ChatMessage[] {
  const saved = loadSession();
  if (saved.messages && saved.messages.length > 0) {
    return saved.messages;
  }
  return DEMO_MESSAGES;
}

function createInitialGame(): GameState {
  const saved = loadSession();
  if (saved.game && saved.game.status !== "idle") {
    return saved.game;
  }
  return { ...INITIAL_GAME_STATE };
}

export function useGameState() {
  const [game, setGame] = useState<GameState>(createInitialGame);
  const [messages, setMessages] = useState<ChatMessage[]>(createInitialMessages);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<GameFeedback>("none");
  const [showConfetti, setShowConfetti] = useState(false);
  const messagesRef = useRef(messages);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  messagesRef.current = messages;

  const isLoading = isAiTyping || isSending;

  const triggerFeedback = useCallback((next: GameFeedback) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);

    setFeedback(next);

    if (next === "win") {
      setShowConfetti(true);
    }

    const duration = next === "wrong" ? 600 : next === "win" ? 8000 : 1200;
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback("none");
      if (next === "win") setShowConfetti(false);
    }, duration);
  }, []);

  useEffect(() => {
    if (game.status === "idle" && messages.length <= 1) return;
    saveSession(game, messages);
  }, [game, messages]);

  useEffect(() => {
    if (!game.isPlaying) return;

    const interval = setInterval(() => {
      setGame((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [game.isPlaying]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const appendMessages = useCallback((...newMessages: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...newMessages]);
  }, []);

  const applyTurn = useCallback(
    (result: EngineResult) => {
      const toAdd: ChatMessage[] = [];

      if (result.systemContent) {
        toAdd.push(createSystemMessage(result.systemContent));
      }

      const assistantTone = result.wasWrongAnswer
        ? "danger"
        : result.levelAdvanced || result.gameWon
          ? "success"
          : "default";

      toAdd.push(
        createAssistantMessage(
          result.assistantContent,
          true,
          assistantTone,
        ),
      );

      if (result.levelAdvanced && result.gameUpdates.level) {
        const intro =
          result.nextLevelIntro ??
          getLevelIntroMessage(result.gameUpdates.level).content;
        toAdd.push(createAssistantMessage(intro, true, "success"));
      }

      appendMessages(...toAdd);

      const nextLevelName = result.gameUpdates.level
        ? getLevel(result.gameUpdates.level).name
        : undefined;

      setGame((prev) => ({
        ...prev,
        ...result.gameUpdates,
        ...(nextLevelName ? { levelName: nextLevelName } : {}),
      }));

      if (result.gameWon) triggerFeedback("win");
      else if (result.levelAdvanced) triggerFeedback("levelUp");
      else if (result.wasWrongAnswer) triggerFeedback("wrong");
    },
    [appendMessages, triggerFeedback],
  );

  const startGame = useCallback(async () => {
    clearSession();
    const levelData = getLevel(1);

    const freshGame: GameState = {
      ...INITIAL_GAME_STATE,
      isPlaying: true,
      status: "playing",
      score: 100,
      level: 1,
      levelName: levelData.name,
    };

    setGame(freshGame);
    setMessages([
      ...DEMO_MESSAGES,
      createSystemMessage("— Game started. Level 1: The Neon Vault —"),
    ]);
    setIsAiTyping(true);

    try {
      const { intro, levelName } = await fetchGameStart();
      setGame((prev) => ({ ...prev, levelName }));
      appendMessages(createAssistantMessage(intro, true));
    } catch {
      appendMessages(
        getLevelIntroMessage(1),
        createSystemMessage(
          "⚠ Neural link unstable — backup narrator engaged.",
        ),
      );
    } finally {
      setIsAiTyping(false);
    }
  }, [appendMessages]);

  const useHint = useCallback(async () => {
    if (game.hintsRemaining <= 0 || !game.isPlaying || isAiTyping || isSending) {
      return;
    }

    const hintTier = game.levelHintIndex;
    const updatedGame: GameState = {
      ...game,
      hintsUsed: game.hintsUsed + 1,
      hintsRemaining: game.hintsRemaining - 1,
      levelHintIndex: game.levelHintIndex + 1,
      score: Math.max(0, game.score - HINT_PENALTY),
    };

    setGame(updatedGame);
    setIsAiTyping(true);

    try {
      const { hint } = await fetchHint(
        updatedGame,
        messagesRef.current,
        hintTier,
      );
      appendMessages(createSystemMessage(`💡 Hint: ${hint}`));
    } catch {
      const fallback = getHintForLevel(game.level, hintTier);
      appendMessages(createSystemMessage(`💡 Hint: ${fallback}`));
    } finally {
      setIsAiTyping(false);
    }
  }, [
    game,
    isAiTyping,
    isSending,
    appendMessages,
  ]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    appendMessages(userMessage);
    setInput("");

    if (!game.isPlaying || game.status === "won") return;

    setIsSending(true);
    setIsAiTyping(true);

    const gameWithBonus: GameState = {
      ...game,
      score: game.score + MESSAGE_BONUS,
    };
    setGame(gameWithBonus);

    try {
      const result = await fetchChat(
        trimmed,
        gameWithBonus,
        [...messagesRef.current, userMessage],
      );
      applyTurn(result);
    } catch {
      const fallback = processUserMessage(trimmed, gameWithBonus);
      applyTurn(fallback);
      appendMessages(
        createSystemMessage("⚠ Neural link unstable — backup narrator engaged."),
      );
    } finally {
      setIsAiTyping(false);
      setIsSending(false);
    }
  }, [
    input,
    game,
    isSending,
    isAiTyping,
    appendMessages,
    applyTurn,
  ]);

  const resetGame = useCallback(() => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    clearSession();
    setGame({ ...INITIAL_GAME_STATE });
    setMessages(DEMO_MESSAGES);
    setInput("");
    setIsAiTyping(false);
    setIsSending(false);
    setFeedback("none");
    setShowConfetti(false);
  }, []);

  return {
    game,
    messages,
    input,
    setInput,
    isAiTyping,
    isSending,
    isLoading,
    feedback,
    showConfetti,
    startGame,
    useHint,
    sendMessage,
    resetGame,
  };
};
