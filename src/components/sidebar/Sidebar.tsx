import {
  Clock,
  HelpCircle,
  Layers,
  Lightbulb,
  Play,
  Trophy,
} from "lucide-react";
import type { GameState } from "../../types";
import { formatTime } from "../../utils/formatTime";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { StatCard } from "./StatCard";

interface SidebarProps {
  game: GameState;
  onStartGame: () => void;
  onUseHint: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  game,
  onStartGame,
  onUseHint,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col gap-4 border-r border-white/5 p-4 pt-20 transition-transform duration-300 ease-out lg:static lg:z-0 lg:w-80 lg:translate-x-0 lg:pt-4 lg:glass-strong",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="glass-strong flex h-full flex-col gap-4 rounded-2xl p-4 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
          <div className="hidden lg:block">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Mission Control
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Trophy size={20} />}
              label="Score"
              value={game.score}
              accent="green"
            />
            <StatCard
              icon={<Clock size={20} />}
              label="Timer"
              value={formatTime(game.elapsedSeconds)}
              accent="cyan"
            />
            <StatCard
              icon={<Layers size={20} />}
              label="Level"
              value={`${game.level}`}
              accent="purple"
            />
            <StatCard
              icon={<Lightbulb size={20} />}
              label="Hints"
              value={`${game.hintsRemaining}/${game.hintsRemaining + game.hintsUsed}`}
              accent="magenta"
            />
          </div>

          <GlassCard glow="cyan" className="flex-1 p-4">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle size={16} className="text-[#00f5ff]" />
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400">
                Hint System
              </h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Stuck in the vault? Use a hint to reveal clues. Each hint costs
              25 points.
            </p>
            <NeonButton
              variant="magenta"
              size="sm"
              fullWidth
              onClick={onUseHint}
              disabled={
                !game.isPlaying ||
                game.hintsRemaining <= 0 ||
                game.status === "won"
              }
            >
              <Lightbulb size={16} />
              Use Hint ({game.hintsRemaining} left)
            </NeonButton>
          </GlassCard>

          {!game.isPlaying && (
            <NeonButton
              variant="cyan"
              size="lg"
              fullWidth
              onClick={onStartGame}
              className="animate-fade-in"
            >
              <Play size={20} />
              Start Game
            </NeonButton>
          )}

          {game.isPlaying && game.status !== "won" && (
            <GlassCard className="p-3">
              <p className="text-center text-xs text-slate-500">
                {game.levelName} — solve puzzles via chat
              </p>
            </GlassCard>
          )}

          {game.status === "won" && (
            <GlassCard glow="cyan" className="p-3">
              <p className="text-center text-xs font-medium text-[#39ff14]">
                Escape complete! Score: {game.score}
              </p>
            </GlassCard>
          )}
        </div>
      </aside>
    </>
  );
}
