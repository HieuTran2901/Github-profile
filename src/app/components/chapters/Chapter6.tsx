import { useState, useContext, memo } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const steps = [
  {
    id: 0,
    label: "Idea",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        <circle cx="12" cy="12" r="5" />
      </svg>
    ),
    color: "#f59e0b",
    detail: "Discovering user problems, drafting solutions, and defining success metrics.",
  },
  {
    id: 1,
    label: "Architecture",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    color: "#818cf8",
    detail: "Designing system diagrams, defining APIs, and selecting the right technology stack.",
  },
  {
    id: 2,
    label: "Backend",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    color: "#22c55e",
    detail: "Building robust APIs, microservices, database schemas, and message queues.",
  },
  {
    id: 3,
    label: "Frontend",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: "#38bdf8",
    detail: "Crafting performant, accessible UIs with React, TypeScript, and modern design systems.",
  },
  {
    id: 4,
    label: "AI Layer",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      </svg>
    ),
    color: "#a855f7",
    detail: "Integrating LLMs, building recommendation engines, and AI-powered data pipelines.",
  },
  {
    id: 5,
    label: "Deployment",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18z" />
      </svg>
    ),
    color: "#ec4899",
    detail: "CI/CD pipelines, containerized deployments on AWS, monitoring and auto-scaling.",
  },
];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function clamp(min: number, max: number, val: number) { return Math.max(min, Math.min(max, val)); }

export const Chapter6 = memo(function Chapter6({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // PHASE 2H: Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 5)); // i = 5 for Chapter6

  // Discrete state: triggered + activeStep
  useMotionValueEvent(cp, "change", (latest) => {
    // One-shot triggered
    if (latest > 0.08 && !triggered) {
      setTriggered(true);
    }

    // activeStep — only setState when index actually changes
    const innerProgress = clamp(0, 1, (latest - 0.1) / 0.7);
    const newStep = Math.min(steps.length - 1, Math.floor(innerProgress * steps.length));
    if (newStep !== activeStep) {
      setActiveStep(newStep);
    }
  });

  // Continuous scroll animations via MotionValue
  const opacity = useTransform(cp, (v) => {
    const entering = v < 0.15;
    const exiting = v > 0.82;
    return entering ? easeOut(v / 0.15) : exiting ? 1 - easeOut((v - 0.82) / 0.18) : 1;
  });

  const translateX = useTransform(cp, (v) => {
    const entering = v < 0.15;
    return entering ? (1 - easeOut(v / 0.15)) * 40 : 0;
  });

  const lineWidth = useTransform(cp, (v) => {
    const inner = clamp(0, 1, (v - 0.1) / 0.7);
    return `${inner * 100}%`;
  });

  // PHASE 3D: 3D Spatial Depth MotionValues
  const rotateX = useTransform(cp, (v) => v * -5);
  const rotateY = useTransform(cp, () => mouse.x * 5);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity,
        x: translateX,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 55% at ${50 + mouse.x * 10}% ${50 + mouse.y * 10}%, ${steps[activeStep]?.color || "#38bdf8"}08 0%, transparent 65%)`,
        transition: "background 0.6s ease",
      }} />

      {/* Chapter label */}
      <div className="absolute top-8 left-8" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "0.25em", transform: "translateZ(20px)" }}>
        CHAPTER 06 / WORKFLOW
      </div>

      <motion.div
        className="w-full h-full flex flex-col items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Title */}
        <div className="absolute top-14 md:top-10 left-8 md:left-1/2" style={{ transform: "translateX(-50%) translateZ(20px)", textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", letterSpacing: "0.3em", marginBottom: "6px" }}>HOW I BUILD</div>
          <div style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#ffffff" }}>
            THE PROCESS
          </div>
        </div>

        {/* Pipeline with 3D Spatial Layering */}
        <div className="relative w-full px-8 md:px-16 lg:px-24 mt-8" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          {/* Connection line */}
          <div className="relative" style={{ height: "2px", margin: "0 auto", maxWidth: "900px" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: "1px" }} />
            <motion.div style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: lineWidth,
              background: `linear-gradient(90deg, ${steps[0].color}, ${steps[activeStep]?.color || steps[0].color})`,
              boxShadow: `0 0 8px ${steps[activeStep]?.color || steps[0].color}88`,
              transition: "background 0.5s ease, box-shadow 0.5s ease",
              borderRadius: "1px",
            }} />
          </div>

          {/* Steps */}
          <div className="flex justify-between items-start relative" style={{ maxWidth: "900px", margin: "0 auto", marginTop: "-1px", transformStyle: "preserve-3d" }}>
            {steps.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={i} className="flex flex-col items-center" style={{
                  flex: 1,
                  maxWidth: "150px",
                  transform: `translateZ(${isCurrent ? "25px" : "0px"})`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.4s ease",
                }}>
                  {/* Node */}
                  <div style={{
                    width: isCurrent ? "48px" : "36px",
                    height: isCurrent ? "48px" : "36px",
                    borderRadius: "50%",
                    background: isActive
                      ? `radial-gradient(circle at 35% 35%, ${step.color}44, ${step.color}18)`
                      : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${isActive ? step.color : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? step.color : "rgba(255,255,255,0.2)",
                    boxShadow: isCurrent
                      ? `0 0 20px ${step.color}55, 0 0 40px ${step.color}22`
                      : isActive ? `0 0 8px ${step.color}33` : "none",
                    transition: "all 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
                    marginTop: "-17px",
                    cursor: "default",
                  }}>
                    {step.icon}
                  </div>

                  {/* Label */}
                  <div style={{
                    marginTop: "12px",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    color: isCurrent ? step.color : isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                    fontWeight: isCurrent ? 600 : 400,
                    transition: "color 0.4s ease",
                    textAlign: "center",
                  }}>
                    {step.label.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active step detail with Z-depth */}
        <div className="mt-12 md:mt-16 max-w-md text-center px-8" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12, translateZ: -20 }}
            animate={{ opacity: 1, y: 0, translateZ: 0 }}
            exit={{ opacity: 0, y: -8, translateZ: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: `${steps[activeStep]?.color}12`,
              border: `1px solid ${steps[activeStep]?.color}30`,
              borderRadius: "2px",
              padding: "6px 14px",
              marginBottom: "16px",
            }}>
              <span style={{ color: steps[activeStep]?.color, fontSize: "9px", letterSpacing: "0.2em" }}>
                STEP {String(activeStep + 1).padStart(2, "0")} / {steps.length}
              </span>
            </div>
            <p style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
              lineHeight: 1.75,
            }}>
              {steps[activeStep]?.detail}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative background label */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden" style={{
        fontSize: "clamp(4rem, 14vw, 10rem)",
        fontWeight: 700,
        color: "rgba(255,255,255,0.018)",
        letterSpacing: "-0.05em",
        lineHeight: 1,
        transform: "translateZ(-100px)",
      }}>
        WORKFLOW
      </div>
    </motion.div>
  );
});

