import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex max-w-[85%] gap-3 sm:max-w-[75%]">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#a855f7]">
          <Bot size={16} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
            AI Guide
          </span>
          <div className="glass flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 px-5 py-4">
            <span className="h-2 w-2 rounded-full bg-[#a855f7] animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-[#00f5ff] animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-[#ff00aa] animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
