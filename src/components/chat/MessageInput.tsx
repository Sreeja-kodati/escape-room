import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Describe your actions...",
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="glass-strong rounded-2xl border border-white/10 p-3 transition-all duration-300 focus-within:neon-border-cyan focus-within:neon-glow-cyan">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent text-[15px] text-slate-200 placeholder:text-slate-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <NeonButton
          variant="cyan"
          size="sm"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="shrink-0"
        >
          <Send size={18} />
        </NeonButton>
      </div>
      <p className="mt-2 hidden text-[10px] text-slate-600 sm:block">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
