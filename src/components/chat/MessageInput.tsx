import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { Spinner } from "../ui/Spinner";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  loading = false,
  placeholder = "Describe your actions...",
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className={[
        "glass-strong rounded-2xl border p-3 transition-all duration-300",
        loading
          ? "border-[#00f5ff]/30"
          : "border-white/10 focus-within:neon-border-cyan focus-within:neon-glow-cyan",
      ].join(" ")}
    >
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          placeholder={placeholder}
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-slate-200 placeholder:text-slate-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <NeonButton
          variant="cyan"
          size="sm"
          onClick={onSend}
          disabled={disabled || loading || !value.trim()}
          aria-label="Send message"
          className="shrink-0"
        >
          {loading ? <Spinner size="sm" /> : <Send size={18} />}
        </NeonButton>
      </div>
      <p className="mt-2 hidden text-[10px] text-slate-600 sm:block">
        {loading
          ? "Neural link processing…"
          : "Press Enter to send · Shift+Enter for new line"}
      </p>
    </div>
  );
}
