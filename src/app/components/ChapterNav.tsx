interface Props {
  labels: string[];
  active: number;
  onNavigate: (i: number) => void;
}

export function ChapterNav({ labels, active, onNavigate }: Props) {
  return (
    <nav
      aria-label="Chapter Navigation"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3.5 px-2.5 py-4 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      style={{ zIndex: 100 }}
    >
      {/* Background connecting rail spine */}
      <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-cyan-400/20 via-purple-500/20 to-cyan-400/20 pointer-events-none" />

      {labels.map((label, i) => {
        const isActive = i === Math.round(active);
        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            data-hover="true"
            title={`Chapter ${i + 1}: ${label}`}
            className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
          >
            {/* Floating Chapter Label tooltip badge (reveals on active or group-hover) */}
            <div
              className={`absolute right-full mr-3.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "opacity-100 translate-x-0 border-cyan-400/40"
                  : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider">
                <span className={isActive ? "text-cyan-400 font-bold" : "text-white/40"}>
                  0{i + 1}
                </span>
                <span className="text-white/30">/</span>
                <span className={isActive ? "text-white font-medium" : "text-white/70"}>
                  {label}
                </span>
              </div>
            </div>

            {/* Visual Node / Capsule Indicator */}
            <div
              className={`relative z-10 transition-all duration-300 ease-out ${
                isActive
                  ? "w-2.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.9),0_0_24px_rgba(168,85,247,0.5)] scale-100"
                  : "w-2 h-2 rounded-full bg-white/25 hover:bg-white/60 hover:scale-125"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-30" />
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
