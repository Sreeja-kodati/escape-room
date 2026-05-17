interface SpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-5 w-5" };

export function Spinner({ size = "sm", className = "" }: SpinnerProps) {
  return (
    <span
      className={[
        "inline-block animate-spin rounded-full border-2 border-[#00f5ff]/20 border-t-[#00f5ff]",
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    />
  );
}
