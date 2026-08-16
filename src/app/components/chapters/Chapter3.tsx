import { useState, useContext, memo } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

interface TechNode {
  id: string;
  name: string;
  category: string;
  sublabel: string;
  icon: string;
  color: string;
  orbit: 1 | 2;
}

// Ordered for equal circular distribution starting from top (-90 degrees)
const TECH_NODES: TechNode[] = [
  { id: "react", name: "React", category: "FRAMEWORK", sublabel: "UI Library", icon: "⚛️", color: "#38bdf8", orbit: 1 },
  { id: "ts", name: "TypeScript", category: "LANGUAGE", sublabel: "Typed JavaScript", icon: "TS", color: "#818cf8", orbit: 1 },
  { id: "docker", name: "Docker", category: "DEVOPS", sublabel: "Containerization", icon: "🐳", color: "#06b6d4", orbit: 1 },
  { id: "aws", name: "AWS", category: "CLOUD", sublabel: "Cloud Services", icon: "☁️", color: "#fb923c", orbit: 1 },
  { id: "vite", name: "Vite", category: "BUILD TOOL", sublabel: "Frontend Build Tool", icon: "⚡", color: "#a855f7", orbit: 1 },
  { id: "java", name: "Java", category: "LANGUAGE", sublabel: "Programming Language", icon: "☕", color: "#f97316", orbit: 1 },
  { id: "spring", name: "Spring", category: "FRAMEWORK", sublabel: "Backend Framework", icon: "🍃", color: "#22c55e", orbit: 1 },
  { id: "node", name: "Node.js", category: "RUNTIME", sublabel: "JavaScript Runtime", icon: "⬢", color: "#22c55e", orbit: 1 },
  { id: "mysql", name: "MySQL", category: "DATABASE", sublabel: "Relational Database", icon: "🐬", color: "#f59e0b", orbit: 1 },
];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function clamp(min: number, max: number, val: number) { return Math.max(min, Math.min(max, val)); }

export const Chapter3 = memo(function Chapter3({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 2)); // i = 2 for Chapter3

  useMotionValueEvent(cp, "change", (latest) => {
    if (latest > 0.05 && !triggered) {
      setTriggered(true);
    }
  });

  const opacity = useTransform(cp, (v) => {
    const entering = v < 0.18;
    const exiting = v > 0.78;
    return entering ? easeOut(v / 0.18) : exiting ? 1 - easeOut((v - 0.78) / 0.22) : 1;
  });

  const scale = useTransform(cp, (v) => {
    const exiting = v > 0.78;
    return exiting ? 1 + easeOut((v - 0.78) / 0.22) * 0.06 : 1;
  });

  // 3D Spatial Depth MotionValues (Orbit Plane Tilt derived from mouse & subtle scroll)
  const rotateX = useTransform(cp, (v) => (v > 0 ? -v * 4 : 0) - mouse.y * 5);
  const rotateY = useTransform(cp, () => mouse.x * 5);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-between overflow-hidden px-6 md:px-12 lg:px-16"
      style={{
        opacity,
        scale,
        perspective: "1400px",
        perspectiveOrigin: "60% 50%",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      <style>{`
        /* Slow, calm shared orbit rotation (50s / revolution) */
        @keyframes sharedOrbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Counter-rotation to keep cards upright and 100% readable */
        @keyframes cardUprightCounterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .orbit-shared-rotator {
          animation: sharedOrbitSpin 50s linear infinite;
        }
        .orbit-card-counter {
          animation: cardUprightCounterSpin 50s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-shared-rotator,
          .orbit-card-counter {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient Radial Energy Aura */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 65% at ${50 + mouse.x * 12}% ${50 + mouse.y * 10}%, rgba(168,85,247,0.08) 0%, rgba(56,189,248,0.04) 45%, transparent 75%)`,
          transition: "background 0.2s ease",
        }}
      />

      {/* Grid backdrop texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* TOP CHAPTER BADGE (X ≈ 2.5%–4%, Y ≈ 3%–6%) */}
      <div className="absolute top-8 left-8 z-30" style={{ transform: "translateZ(40px)" }}>
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/70 uppercase">
            CHAPTER 03 / SKILLS
          </span>
        </div>
      </div>

      {/* LEFT NARRATIVE PANEL (X ≈ 3%–5%, Y ≈ 28%–57%) */}
      <div className="relative z-20 flex flex-col items-start text-left max-w-sm lg:max-w-md pointer-events-none" style={{ transform: "translateZ(60px)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-purple-400 font-bold text-sm">✦</span>
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase">
            TECHNOLOGY STACK
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-300 to-indigo-400">TOOLS</span>
        </h2>

        <p className="text-white/65 text-xs sm:text-sm leading-relaxed font-light tracking-wide mb-6">
          A curated set of technologies and tools I use to design, build, and ship modern products with efficiency and quality.
        </p>

        <div className="w-16 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-purple-400 to-transparent shadow-[0_0_10px_#38bdf8]" />
      </div>

      {/* RIGHT ORBIT UNIVERSE CENTERED AT (X ≈ 60%, Y ≈ 50%) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          left: "20%", // Positions the common orbital center at ~60% of total viewport width
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* CONCENTRIC MATCHING SVG ORBIT RINGS (Backdrop Z -40px) */}
        <svg
          className="absolute w-[1000px] h-[800px] pointer-events-none opacity-25 z-0"
          viewBox="-500 -400 1000 800"
          style={{ 
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) translateZ(-40px)" 
          }}
        >
          <defs>
            <linearGradient id="orbitRefRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* ONE TRUE CIRCULAR ORBIT RING (Radius 315px) */}
          <circle cx="0" cy="0" r="315" fill="none" stroke="url(#orbitRefRingGrad)" strokeWidth="1.2" strokeDasharray="6 6" />
        </svg>

        {/* STATIONARY CENTRAL CORE STACK NODE (Fixed at center 0,0 with Z 70px) */}
        <div
          className="absolute z-30 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-slate-950/95 border-2 border-sky-400/50 shadow-[0_0_60px_rgba(56,189,248,0.35)] flex flex-col items-center justify-center p-4 text-center backdrop-blur-2xl pointer-events-auto cursor-none group transition-transform duration-500 hover:scale-105"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) translateZ(70px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Concentric glowing inner core pulse rings */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-sky-500/20 via-purple-500/20 to-pink-500/10 border border-sky-400/30 animate-pulse" />
          <div className="absolute -inset-2 rounded-full border border-sky-400/20 border-dashed animate-[spin_40s_linear_infinite]" />

          {/* Center 3D Isometric Cube Visual Box */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/10 border border-sky-400/50 flex items-center justify-center text-sky-300 text-2xl sm:text-3xl mb-2 shadow-[0_0_20px_rgba(56,189,248,0.35)] z-10">
            🧊
          </div>

          <span className="text-sm sm:text-base font-extrabold font-mono text-white tracking-wide uppercase leading-tight z-10">
            My Core Stack
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wider mt-1 z-10">
            Building modern solutions
          </span>
        </div>

        {/* SHARED ROTATING ORBIT CONTAINER (Rotates at 50s/rev around 0,0) */}
        <div
          className="absolute inset-0 flex items-center justify-center orbit-shared-rotator pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* MATHEMATICAL FLOATING TECHNOLOGY NODES */}
          {TECH_NODES.map((node, i) => {
            const isHovered = hoveredIdx === i;
            const R = 315;
            const Rz = 60; // Max depth

            // Equal Angular Distribution (360 / N)
            const angularStep = 360 / TECH_NODES.length;
            const startAngle = -90; // Start at top
            const angleDeg = startAngle + i * angularStep;

            // Strict Mathematical Circle Formula: x = R * cos(theta), y = R * sin(theta), z = depth * sin(theta)
            const rad = (angleDeg * Math.PI) / 180;
            const x = Math.cos(rad) * R;
            const y = Math.sin(rad) * R;
            const z = Math.sin(rad) * Rz;

            const currentZ = isHovered ? z + 50 : z + 10;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="absolute pointer-events-auto cursor-none transition-transform duration-300 group"
                style={{
                  left: "50%",
                  top: "50%",
                  // Position centered at exact mathematical coordinate (x, y, z)
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${currentZ}px) scale(${isHovered ? 1.08 : 0.96})`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Counter-rotation wrapper: Keeps card horizontally upright & 100% readable during orbital revolution */}
                <div
                  className="orbit-card-counter flex flex-col items-center p-3 sm:p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 w-32 sm:w-36 text-center"
                  style={{
                    background: isHovered ? "rgba(30,41,59,0.96)" : "rgba(15,23,42,0.82)",
                    borderColor: isHovered ? node.color : "rgba(255,255,255,0.12)",
                    boxShadow: isHovered
                      ? `0 0 30px ${node.color}66, inset 0 0 12px ${node.color}33`
                      : `0 8px 24px rgba(0,0,0,0.5), 0 0 15px ${node.color}15`,
                  }}
                >
                  {/* Node Icon Box */}
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-1.5 border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${node.color}15`,
                      borderColor: `${node.color}40`,
                      boxShadow: `0 0 15px ${node.color}25`,
                    }}
                  >
                    {node.icon}
                  </div>

                  {/* Technology Name */}
                  <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide truncate w-full">
                    {node.name}
                  </span>

                  {/* Sublabel / Subtitle */}
                  <span className="text-[8px] sm:text-[9px] font-mono text-white/50 truncate w-full mt-0.5">
                    {node.sublabel}
                  </span>

                  {/* Category Pill Tag */}
                  <span
                    className="text-[7px] sm:text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase mt-2 border"
                    style={{
                      background: `${node.color}20`,
                      color: node.color,
                      borderColor: `${node.color}40`,
                    }}
                  >
                    {node.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
});





