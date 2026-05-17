import { useCallback, useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import type { ChatMessage } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { ChatBubble } from "./ChatBubble";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isPlaying: boolean;
  isAiTyping?: boolean;
  isSending?: boolean;
  gameWon?: boolean;
  onPlayAgain?: () => void;
}

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  isPlaying,
  isAiTyping = false,
  isSending = false,
  gameWon = false,
  onPlayAgain,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping, scrollToBottom]);

  const inputDisabled = !isPlaying || isAiTyping || isSending || gameWon;

  return (
    <GlassCard strong glow="cyan" className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <MessageSquare className="h-5 w-5 text-[#00f5ff]" />
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            Neural Link
          </h2>
          <p className="text-xs text-slate-500">Communicate with the AI guide</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
      >
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            onTypewriterComplete={scrollToBottom}
          />
        ))}
        {isAiTyping && <TypingIndicator />}
      </div>

      <div className="border-t border-white/5 p-4 sm:p-5">
        {gameWon && onPlayAgain && (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              onClick={onPlayAgain}
              className="font-display text-sm font-semibold uppercase tracking-widest text-[#00f5ff] transition-colors hover:text-white"
            >
              Play Again
            </button>
          </div>
        )}
        <MessageInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          disabled={inputDisabled}
          placeholder={
            gameWon
              ? "Mission complete!"
              : isAiTyping
                ? "AI is thinking..."
                : isPlaying
                  ? "What do you do next?"
                  : "Start the game to begin chatting..."
          }
        />
      </div>
    </GlassCard>
  );
}
