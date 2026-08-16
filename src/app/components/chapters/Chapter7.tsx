import { useEffect, useRef, useState, useContext, memo } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const stats = [
  { value: 3, suffix: "+", label: "Years of Experience", color: "#38bdf8" },
  { value: 15, suffix: "+", label: "Projects Shipped", color: "#a855f7" },
  { value: 9, suffix: "", label: "Core Technologies", color: "#22c55e" },
  { value: 100, suffix: "k+", label: "Lines of Code Contributed", color: "#f97316" },
];


const languages = [
  { name: "Java", pct: 45, color: "#f97316" },
  { name: "TypeScript", pct: 28, color: "#818cf8" },
  { name: "SQL", pct: 12, color: "#f59e0b" },
  { name: "Python", pct: 8, color: "#22c55e" },
  { name: "Bash", pct: 4, color: "#38bdf8" },
  { name: "Other", pct: 3, color: "rgba(255,255,255,0.2)" },
];

// Generate fake contribution data (52 weeks × 7 days)
const weeks = 52;
const days = 7;
const contributions = Array.from({ length: weeks }, (_, w) =>
  Array.from({ length: days }, (_, d) => {
    const seed = w * 7 + d;
    // More activity in recent weeks
    const recency = w / weeks;
    const chance = 0.25 + recency * 0.4;
    const val = Math.random() < chance ? Math.floor(Math.random() * 4) + 1 : 0;
    return val;
  })
);

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

function Counter({ target, suffix, active, color }: { target: number; suffix: string; active: boolean; color: string }) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const duration = 1800 + Math.random() * 400;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const easedT = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(easedT * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [active, target]);

  return (
    <span style={{
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      fontWeight: 700,
      letterSpacing: "-0.04em",
      background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.8))`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>
      {val}{suffix}
    </span>
  );
}

const contribColors = [
  "rgba(255,255,255,0.04)",
  "rgba(56,189,248,0.2)",
  "rgba(56,189,248,0.45)",
  "rgba(56,189,248,0.7)",
  "rgba(56,189,248,0.95)",
];

export const Chapter7 = memo(function Chapter7({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [visibleWeeks, setVisibleWeeks] = useState(1);

  // PHASE 2I: Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => {
    const raw = v - 6; // i = 6 for Chapter7
    return Math.max(-0.5, Math.min(1.5, raw));
  });

  // Discrete state: triggered + visibleWeeks
  useMotionValueEvent(cp, "change", (latest) => {
    // One-shot triggered
    if (latest > 0.1 && !triggered) {
      setTriggered(true);
    }

    // visibleWeeks — only setState when integer count changes
    const contribReveal = Math.min(1, Math.max(0, (latest - 0.1) / 0.6));
    const newWeeks = Math.max(1, Math.floor(contribReveal * weeks));
    if (newWeeks !== visibleWeeks) {
      setVisibleWeeks(newWeeks);
    }
  });

  // Continuous scroll animations via MotionValue
  const opacity = useTransform(cp, (v) => {
    const entering = v < 0.15;
    const exiting = v > 0.82;
    return entering ? easeOut(v / 0.15) : exiting ? 1 - easeOut((v - 0.82) / 0.18) : 1;
  });

  const translateY = useTransform(cp, (v) => {
    const entering = v < 0.15;
    const exiting = v > 0.82;
    return entering ? (1 - easeOut(v / 0.15)) * 50 : exiting ? -easeOut((v - 0.82) / 0.18) * 30 : 0;
  });

  // PHASE 3D: 3D Spatial Depth MotionValues
  const rotateX = useTransform(cp, (v) => v * -6);
  const rotateY = useTransform(cp, () => mouse.x * 6);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-8 md:px-16 lg:px-24"
      style={{
        opacity,
        y: translateY,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 60% at ${50 + mouse.x * 10}% ${50 + mouse.y * 10}%, rgba(56,189,248,0.05) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)`,
      }} />

      {/* Chapter label */}
      <div className="absolute top-8 left-8" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "0.25em", transform: "translateZ(20px)" }}>
        CHAPTER 07 / STATISTICS
      </div>

      <motion.div
        className="w-full max-w-5xl flex flex-col gap-8 md:gap-10 mt-8 md:mt-0"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transform: "translateZ(20px)" }}
        >
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", letterSpacing: "0.3em", marginBottom: "8px" }}>
            BY THE NUMBERS
          </div>
          <div style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#ffffff" }}>
            GITHUB STATS
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={triggered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                padding: "20px 18px",
                backdropFilter: "blur(8px)",
                borderTop: `1px solid ${s.color}33`,
              }}
            >
              <Counter target={s.value} suffix={s.suffix} active={triggered} color={s.color} />
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "0.12em", marginTop: "8px" }}>
                {s.label.toUpperCase()}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8" style={{ transformStyle: "preserve-3d" }}>
          {/* Contribution graph with 3D Spatial Plane Surface */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={triggered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex-1"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              padding: "16px",
              transform: "translateZ(50px) rotateX(4deg)",
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "0.2em", marginBottom: "12px" }}>
              CONTRIBUTION ACTIVITY — LAST 52 WEEKS
            </div>
            <div style={{
              display: "flex",
              gap: "2px",
              overflowX: "auto",
              overflowY: "hidden",
            }}>
              {contributions.slice(0, Math.max(1, visibleWeeks)).map((week, w) => (
                <div key={w} style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                  {week.map((day, d) => (
                    <div
                      key={d}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "1px",
                        background: contribColors[day],
                        transition: "background 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-2 mt-3" style={{ opacity: 0.5 }}>
              <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>LESS</span>
              {contribColors.map((c, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "1px", background: c }} />
              ))}
              <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>MORE</span>
            </div>
          </motion.div>

          {/* Language bars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={triggered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            style={{
              width: "100%",
              maxWidth: "260px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              padding: "16px",
              flexShrink: 0,
              transform: "translateZ(40px)",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "0.2em", marginBottom: "16px" }}>
              TOP LANGUAGES
            </div>
            <div className="flex flex-col gap-3">
              {languages.map((lang, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>{lang.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>{lang.pct}%</span>
                  </div>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: triggered ? `${lang.pct}%` : "0%",
                      background: lang.color,
                      borderRadius: "2px",
                      transition: `width 1s ease ${0.5 + i * 0.1}s`,
                      boxShadow: `0 0 6px ${lang.color}66`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

