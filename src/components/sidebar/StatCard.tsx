import type { ReactNode } from "react";
import { GlassCard } from "../ui/GlassCard";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: "cyan" | "magenta" | "green" | "purple";
}

const accentColors = {
  cyan: "text-[#00f5ff]",
  magenta: "text-[#ff00aa]",
  green: "text-[#39ff14]",
  purple: "text-[#a855f7]",
};

export function StatCard({ icon, label, value, accent = "cyan" }: StatCardProps) {
  return (
    <GlassCard className="p-4 transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <p
            className={`mt-1 font-display text-2xl font-bold ${accentColors[accent]}`}
          >
            {value}
          </p>
        </div>
        <div className={`opacity-70 ${accentColors[accent]}`}>{icon}</div>
      </div>
    </GlassCard>
  );
}
