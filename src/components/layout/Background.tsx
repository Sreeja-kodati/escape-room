export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#00f5ff]/8 blur-[100px] animate-float" />
      <div
        className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-[#ff00aa]/8 blur-[100px] animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#a855f7]/6 blur-[80px]" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]/80" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.15) 2px, rgba(0,245,255,0.15) 4px)",
        }}
      />
    </div>
  );
}
