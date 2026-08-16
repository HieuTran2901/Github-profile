interface Props {
  labels: string[];
  active: number;
  onNavigate: (i: number) => void;
}

export function ChapterNav({ labels, active, onNavigate }: Props) {
  return (
    <div
      className="absolute right-6 top-1/2 flex flex-col gap-3"
      style={{ transform: "translateY(-50%)", zIndex: 100 }}
    >
      {labels.map((label, i) => {
        const isActive = i === Math.round(active);
        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            data-hover="true"
            title={`Chapter ${i + 1}: ${label}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              padding: "4px 0",
              cursor: "none",
              position: "relative",
            }}
          >
            {/* Label (hidden, shows on hover) */}
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "9px",
                letterSpacing: "0.15em",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(8px)",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              {`0${i + 1} — ${label}`}
            </span>

            {/* Dot */}
            <div
              style={{
                width: isActive ? "20px" : "6px",
                height: "2px",
                borderRadius: "1px",
                background: isActive
                  ? "linear-gradient(90deg, #38bdf8, #a855f7)"
                  : "rgba(255,255,255,0.2)",
                boxShadow: isActive ? "0 0 8px rgba(56,189,248,0.6)" : "none",
                transition: "all 0.3s ease",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
