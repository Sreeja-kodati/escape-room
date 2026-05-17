interface LoadingBarProps {
  active: boolean;
  label?: string;
}

export function LoadingBar({ active, label }: LoadingBarProps) {
  if (!active) return null;

  return (
    <div className="border-b border-[#00f5ff]/10 bg-black/30 px-4 py-2.5 animate-fade-in">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f5ff] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f5ff]" />
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-[#00f5ff]/80">
          {label ?? "Neural link active"}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent animate-loading-slide" />
      </div>
    </div>
  );
}
