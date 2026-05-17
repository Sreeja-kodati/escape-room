import type { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "cyan" | "magenta" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantClasses = {
  cyan: [
    "bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/40",
    "hover:bg-[#00f5ff]/20 hover:neon-glow-cyan",
    "active:scale-[0.98]",
  ].join(" "),
  magenta: [
    "bg-[#ff00aa]/10 text-[#ff00aa] border-[#ff00aa]/40",
    "hover:bg-[#ff00aa]/20 hover:neon-glow-magenta",
    "active:scale-[0.98]",
  ].join(" "),
  ghost: [
    "bg-transparent text-slate-300 border-white/10",
    "hover:bg-white/5 hover:text-white",
    "active:scale-[0.98]",
  ].join(" "),
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-8 py-3.5 text-lg gap-2.5",
};

export function NeonButton({
  children,
  variant = "cyan",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: NeonButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center font-display font-semibold",
        "rounded-xl border transition-all duration-300",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
