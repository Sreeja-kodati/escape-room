import { Sparkles } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";

import { Spinner } from "../ui/Spinner";

interface WelcomeHeroProps {
  onStartGame: () => void;
  isLoading?: boolean;
}

export function WelcomeHero({ onStartGame, isLoading = false }: WelcomeHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center animate-fade-in sm:px-6 sm:py-12">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#00f5ff]/30 bg-[#00f5ff]/5 neon-glow-cyan animate-float">
        <Sparkles className="h-10 w-10 text-[#00f5ff]" />
      </div>

      <h2 className="font-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
        Enter the <span className="neon-text-cyan">Neon Vault</span>
      </h2>
      <p className="mt-3 max-w-md text-base leading-relaxed text-slate-400">
        An AI-powered escape room where your words are your keys. Explore,
        puzzle-solve, and escape — all through conversation.
      </p>

      <NeonButton
        variant="cyan"
        size="lg"
        onClick={onStartGame}
        disabled={isLoading}
        className="mt-8 sm:hidden"
      >
        {isLoading ? <Spinner size="sm" /> : null}
        Start Game
      </NeonButton>
    </div>
  );
}
