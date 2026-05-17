import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex max-w-[90%] gap-3 sm:max-w-[78%]">
        <div className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#a855f7]/20 animate-glow-pulse" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 text-[#a855f7]">
            <Bot size={17} />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a855f7]/80">
            AI Guide · transmitting
          </span>
          <div className="glass flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[#a855f7]/25 px-5 py-4 neon-glow-magenta">
            <span className="h-2.5 w-2.5 rounded-full bg-[#a855f7] animate-bounce [animation-delay:0ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00f5ff] animate-bounce [animation-delay:120ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff00aa] animate-bounce [animation-delay:240ms]" />
            <span className="ml-1 hidden text-xs text-slate-500 sm:inline">
              decoding neural stream…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
