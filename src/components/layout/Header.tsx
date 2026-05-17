import { Lock, Menu, X } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { Spinner } from "../ui/Spinner";

interface HeaderProps {
  isPlaying: boolean;
  isLoading?: boolean;
  onStartGame: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({
  isPlaying,
  isLoading = false,
  onStartGame,
  onToggleSidebar,
  sidebarOpen,
}: HeaderProps) {
  return (
    <header className="glass-strong sticky top-0 z-30 border-b border-white/5 px-3 py-2.5 transition-all duration-300 sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-[#00f5ff] lg:hidden"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f5ff]/30 bg-[#00f5ff]/10 neon-glow-cyan">
              <Lock className="h-4 w-4 text-[#00f5ff]" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wider text-white sm:text-xl">
                AI <span className="neon-text-cyan">ESCAPE</span>
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Neural containment protocol v1.0
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isPlaying && (
            <NeonButton
              variant="cyan"
              size="sm"
              onClick={onStartGame}
              disabled={isLoading}
              className="hidden sm:inline-flex"
            >
              {isLoading ? <Spinner size="sm" /> : null}
              Start Game
            </NeonButton>
          )}
          <div className="hidden items-center gap-2 sm:flex">
            <span
              className={[
                "h-2 w-2 rounded-full animate-pulse-glow",
                isLoading ? "bg-[#00f5ff]" : isPlaying ? "bg-[#39ff14]" : "bg-slate-600",
              ].join(" ")}
            />
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
              {isLoading ? "Syncing" : isPlaying ? "Live" : "Standby"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
