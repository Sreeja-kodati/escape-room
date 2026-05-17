import { MAX_LEVEL } from "../../data/levels";

interface ProgressBarProps {
  level: number;
  status: "idle" | "playing" | "won";
  className?: string;
}

export function ProgressBar({ level, status, className = "" }: ProgressBarProps) {
  const completedLevels = status === "won" ? MAX_LEVEL : Math.max(0, level - 1);
  const currentProgress =
    status === "won" ? 100 : ((completedLevels + 0.35) / MAX_LEVEL) * 100;
  const percent = Math.min(100, Math.round(currentProgress));

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Escape Progress
        </span>
        <span className="font-display text-xs font-bold text-[#00f5ff]">
          {status === "won" ? "100%" : `${percent}%`}
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full border border-white/10 bg-black/40">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00f5ff] via-[#a855f7] to-[#ff00aa] transition-all duration-700 ease-out animate-glow-bar"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute inset-0 animate-shimmer opacity-30" />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-slate-600">
        {Array.from({ length: MAX_LEVEL }, (_, i) => (
          <span
            key={i}
            className={
              i + 1 <= level || status === "won"
                ? "text-[#00f5ff] neon-text-cyan"
                : ""
            }
          >
            L{i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
