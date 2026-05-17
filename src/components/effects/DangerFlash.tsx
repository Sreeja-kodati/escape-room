interface DangerFlashProps {
  active: boolean;
}

export function DangerFlash({ active }: DangerFlashProps) {
  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none fixed inset-0 z-50 transition-opacity duration-150",
        active ? "animate-danger-flash opacity-100" : "opacity-0",
      ].join(" ")}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,0,60,0.25) 0%, rgba(180,0,30,0.12) 45%, transparent 70%)",
        boxShadow: active ? "inset 0 0 120px rgba(255,0,60,0.35)" : "none",
      }}
    />
  );
}
