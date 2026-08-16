import { useEffect, useRef, useState, useContext, memo } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const metrics = [
  { value: 500, suffix: "+", label: "Active Users" },
  { value: 95, suffix: "%", label: "AI Accuracy" },
  { value: 3, suffix: "s", label: "Avg Response" },
  { value: 99, suffix: "%", label: "Uptime SLA" },
];

const techStack = ["Java", "Spring Boot", "React", "TypeScript", "OpenAI", "AWS", "Docker", "MySQL", "Redis"];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function clamp(min: number, max: number, val: number) { return Math.max(min, Math.min(max, val)); }

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const easedT = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(easedT * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [active, target]);

  return <span>{val}{suffix}</span>;
}

export const Chapter4 = memo(function Chapter4({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);

  // PHASE 2G: Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 3)); // i = 3 for Chapter4

  useMotionValueEvent(cp, "change", (latest) => {
    if (latest > 0.12 && !triggered) {
      setTriggered(true);
    }
  });

  const opacity = useTransform(cp, (v) => {
    const entering = v < 0.18;
    const exiting = v > 0.78;
    return entering ? easeOut(v / 0.18) : exiting ? 1 - easeOut((v - 0.78) / 0.22) : 1;
  });

  const translateY = useTransform(cp, (v) => {
    const entering = v < 0.18;
    const exiting = v > 0.78;
    return entering ? (1 - easeOut(v / 0.18)) * 60 : exiting ? -easeOut((v - 0.78) / 0.22) * 40 : 0;
  });

  // PHASE 3B: 3D Spatial Depth MotionValues (Mockup Tilt & Depth)
  const mockupRotateX = useTransform(cp, (v) => (v > 0 ? -v * 6 : 0) - mouse.y * 8);
  const mockupRotateY = useTransform(cp, () => mouse.x * 12);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center overflow-hidden"
      style={{
        opacity,
        y: translateY,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 50% at ${70 + mouse.x * 15}% ${50 + mouse.y * 10}%, rgba(56,189,248,0.06) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)`,
        transition: "background 0.15s ease",
        transform: "translateZ(-100px)",
      }} />

      {/* Chapter label */}
      <div className="absolute top-8 left-8" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "0.25em", transform: "translateZ(20px)" }}>
        CHAPTER 04 / FEATURED PROJECT
      </div>

      <div className="w-full h-full flex flex-col md:flex-row items-center px-8 md:px-16 lg:px-24 gap-8 md:gap-16 pt-16 md:pt-0" style={{ transformStyle: "preserve-3d" }}>
        {/* Left content */}
        <div className="flex flex-col gap-6 md:w-[45%] lg:w-[40%] flex-shrink-0" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={triggered ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transform: "translateZ(30px)" }}
          >
            <div style={{ color: "rgba(56,189,248,0.7)", fontSize: "10px", letterSpacing: "0.3em", marginBottom: "12px" }}>
              FEATURED PROJECT
            </div>
            <h2 style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#ffffff",
              marginBottom: "16px",
            }}>
              AI Travel<br />Marketplace
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)", lineHeight: 1.75, maxWidth: "380px" }}>
              An intelligent platform that connects travelers with personalized experiences powered by LLMs, real-time data, and distributed microservices.
            </p>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={triggered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap gap-2"
            style={{ transform: "translateZ(40px)" }}
          >
            {techStack.map((tech, i) => (
              <span
                key={tech}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  padding: "5px 12px",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  animation: triggered ? `floatY ${3 + i * 0.2}s ease-in-out ${i * 0.1}s infinite` : "none",
                }}
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Metrics grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={triggered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3"
            style={{ transform: "translateZ(50px)" }}
          >
            {metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "2px",
                  padding: "14px 16px",
                  backdropFilter: "blur(8px)",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateZ(15px) scale(1.03)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(56,189,248,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateZ(0px) scale(1)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <div style={{
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #38bdf8, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}>
                  <Counter target={m.value} suffix={m.suffix} active={triggered} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "0.15em" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={triggered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex gap-3"
            style={{ transform: "translateZ(55px)" }}
          >
            <button
              data-hover="true"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(168,85,247,0.15))",
                border: "1px solid rgba(56,189,248,0.35)",
                borderRadius: "2px",
                padding: "11px 22px",
                color: "#38bdf8",
                fontSize: "10px",
                letterSpacing: "0.2em",
                cursor: "none",
                animation: "pulse-glow 2.5s ease infinite",
                transition: "all 0.3s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              VIEW REPOSITORY
            </button>
            <button
              data-hover="true"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                padding: "11px 22px",
                color: "rgba(255,255,255,0.4)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                cursor: "none",
                transition: "all 0.3s ease",
              }}
            >
              LIVE DEMO
            </button>
          </motion.div>
        </div>

        {/* Right: Mockup with 3D Card Tilt & Elevation */}
        <motion.div
          className="flex-1 flex items-center justify-center min-h-0"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={triggered ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxHeight: "65vh",
            rotateX: mockupRotateX,
            rotateY: mockupRotateY,
            transformStyle: "preserve-3d",
            transform: "translateZ(70px)",
          }}
        >
          <div style={{
            width: "100%",
            maxWidth: "520px",
            aspectRatio: "16/10",
            background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(168,85,247,0.08))",
            border: "1px solid rgba(56,189,248,0.25)",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 50px rgba(56,189,248,0.12), 0 40px 90px rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            transformStyle: "preserve-3d",
          }}>
            {/* Fake browser chrome */}
            <div style={{
              height: "30px",
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: "6px",
            }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c, opacity: 0.7 }} />
              ))}
              <div style={{ flex: 1, height: "14px", background: "rgba(255,255,255,0.04)", borderRadius: "2px", margin: "0 8px" }} />
            </div>
            {/* App content mockup */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", height: "calc(100% - 30px)" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: "80px", height: "14px", background: "linear-gradient(90deg, #38bdf8, #a855f7)", borderRadius: "2px", opacity: 0.6 }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  {[60, 45, 55].map((w, i) => <div key={i} style={{ width: w, height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />)}
                </div>
              </div>
              {/* Hero section */}
              <div style={{
                flex: 1,
                background: "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(168,85,247,0.08))",
                borderRadius: "4px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: "1px solid rgba(56,189,248,0.1)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ width: "70%", height: "12px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", marginBottom: "8px" }} />
                  <div style={{ width: "90%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "4px" }} />
                  <div style={{ width: "60%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "12px" }} />
                  <div style={{ width: "80px", height: "22px", background: "linear-gradient(90deg, rgba(56,189,248,0.4), rgba(168,85,247,0.4))", borderRadius: "2px" }} />
                </div>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(168,85,247,0.2))",
                  border: "1px solid rgba(56,189,248,0.2)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.6)" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
              {/* Cards row */}
              <div style={{ display: "flex", gap: "8px" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    flex: 1,
                    height: "50px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}>
                    <div style={{ width: "40%", height: "6px", background: "rgba(56,189,248,0.3)", borderRadius: "2px" }} />
                    <div style={{ width: "70%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />
                  </div>
                ))}
              </div>
            </div>
            {/* Glow overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(56,189,248,0.05) 0%, transparent 50%, rgba(168,85,247,0.05) 100%)",
              pointerEvents: "none",
            }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

