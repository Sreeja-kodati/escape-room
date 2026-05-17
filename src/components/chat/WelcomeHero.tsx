import { Sparkles } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";

interface WelcomeHeroProps {
  onStartGame: () => void;
}

export function WelcomeHero({ onStartGame }: WelcomeHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
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
        className="mt-8 sm:hidden"
      >
        Start Game
      </NeonButton>
    </div>
  );
}
