import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  glow?: "cyan" | "magenta" | "none";
}

const glowClasses = {
  cyan: "neon-border-cyan neon-glow-cyan",
  magenta: "neon-glow-magenta border-[#ff00aa]/30",
  none: "",
};

export function GlassCard({
  children,
  className = "",
  strong = false,
  glow = "none",
}: GlassCardProps) {
  return (
    <div
      className={[
        strong ? "glass-strong" : "glass",
        "rounded-2xl",
        glowClasses[glow],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
