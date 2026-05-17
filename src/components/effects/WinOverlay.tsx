import { Trophy } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";

interface WinOverlayProps {
  score: number;
  elapsedSeconds: number;
  onPlayAgain: () => void;
}

export function WinOverlay({
  score,
  elapsedSeconds,
  onPlayAgain,
}: WinOverlayProps) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const time = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center p-4">
      <div
        className="pointer-events-auto glass-strong max-w-sm animate-scale-in rounded-3xl border border-[#39ff14]/30 p-8 text-center neon-glow-cyan"
        role="dialog"
        aria-label="Victory"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#39ff14]/40 bg-[#39ff14]/10 animate-float">
          <Trophy className="h-8 w-8 text-[#39ff14]" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-wide text-white">
          You <span className="neon-text-cyan">Escaped!</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          The Neon Vault is behind you. Mission accomplished.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Score
            </p>
            <p className="font-display text-xl font-bold text-[#39ff14]">
              {score}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Time
            </p>
            <p className="font-display text-xl font-bold text-[#00f5ff]">
              {time}
            </p>
          </div>
        </div>
        <NeonButton
          variant="cyan"
          size="lg"
          fullWidth
          onClick={onPlayAgain}
          className="mt-6"
        >
          Play Again
        </NeonButton>
      </div>
    </div>
  );
}
