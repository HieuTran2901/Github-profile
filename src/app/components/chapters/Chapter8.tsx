import { useEffect, useState, useContext, memo } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { ScrollCtx, MotionCtx } from "../../App";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const socials = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hieu@example.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function clamp(min: number, max: number, val: number) { return Math.max(min, Math.min(max, val)); }

export const Chapter8 = memo(function Chapter8({ visible }: Props) {
  const { mouse } = useContext(ScrollCtx);
  const { motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [hovered, setHovered] = useState(false);

  // PHASE 2J: Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 7)); // i = 7 for Chapter8

  useMotionValueEvent(cp, "change", (latest) => {
    if (latest > 0.1 && !triggered) {
      setTriggered(true);
    }
  });

  const opacity = useTransform(cp, (v) => {
    const entering = v < 0.2;
    return entering ? easeOut(v / 0.2) : 1;
  });

  const translateY = useTransform(cp, (v) => {
    const entering = v < 0.2;
    return entering ? (1 - easeOut(v / 0.2)) * 60 : 0;
  });

  // PHASE 3D: 3D Spatial Depth MotionValues
  const rotateX = useTransform(cp, (v) => v * -4);
  const rotateY = useTransform(cp, () => mouse.x * 7);

  if (!visible) return null;

  const parallaxX = mouse.x * 8;
  const parallaxY = mouse.y * 6;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        opacity,
        y: translateY,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 65% 65% at ${50 + mouse.x * 20}% ${50 + mouse.y * 15}%, rgba(168,85,247,0.1) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)`,
        transition: "background 0.12s ease",
      }} />

      {/* Decorative rings */}
      {[280, 420, 560].map((r, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          width: r,
          height: r,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.025)",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${parallaxX * (0.2 + i * 0.1)}px, ${parallaxY * (0.15 + i * 0.08)}px) translateZ(-80px)`,
          transition: "transform 0.1s ease",
        }} />
      ))}

      {/* Chapter label */}
      <div className="absolute top-8 left-8" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "0.25em", transform: "translateZ(20px)" }}>
        CHAPTER 08 / CONTACT
      </div>

      {/* Footer label */}
      <div className="absolute bottom-6 left-8" style={{ color: "rgba(255,255,255,0.12)", fontSize: "9px", letterSpacing: "0.15em", transform: "translateZ(20px)" }}>
        TRAN HUU TRUNG HIEU · AI FULL STACK DEVELOPER · 2024
      </div>

      {/* Main content with 3D spatial depth */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-8 max-w-4xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ color: "rgba(56,189,248,0.7)", fontSize: "11px", letterSpacing: "0.35em", marginBottom: "24px", transform: "translateZ(40px)" }}
        >
          OPEN TO OPPORTUNITIES
        </motion.div>

        {/* Big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2rem, 7vw, 6rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#ffffff",
            marginBottom: "24px",
            textShadow: "0 0 80px rgba(168,85,247,0.3)",
            transform: "translateZ(60px)",
          }}
        >
          Let's Build<br />
          <span style={{
            background: "linear-gradient(135deg, #38bdf8, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Something Great.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "clamp(0.85rem, 1.4vw, 1.05rem)",
            lineHeight: 1.75,
            maxWidth: "440px",
            marginBottom: "40px",
            transform: "translateZ(50px)",
          }}
        >
          Whether you have a project in mind, want to collaborate, or just want to talk tech — I'm always open to interesting conversations.
        </motion.p>

        {/* Main CTA with striking Z-elevation focal point */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={triggered ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "40px", transform: "translateZ(80px)" }}
        >
          <button
            data-hover="true"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "relative",
              padding: "16px 44px",
              background: hovered
                ? "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(168,85,247,0.25))"
                : "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(168,85,247,0.12))",
              border: "1px solid rgba(56,189,248,0.4)",
              borderRadius: "2px",
              color: "#38bdf8",
              fontSize: "12px",
              letterSpacing: "0.25em",
              cursor: "none",
              boxShadow: hovered
                ? "0 0 40px rgba(56,189,248,0.25), 0 0 80px rgba(168,85,247,0.15)"
                : "0 0 20px rgba(56,189,248,0.1)",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            GET IN TOUCH
          </button>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          style={{ marginBottom: "36px", transform: "translateZ(45px)" }}
        >
          <a
            href="mailto:hieu@example.com"
            data-hover="true"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
              letterSpacing: "0.05em",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "2px",
              transition: "all 0.3s ease",
              cursor: "none",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#38bdf8"; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "rgba(56,189,248,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "rgba(255,255,255,0.1)"; }}
          >
            tranhuutrunghieu@example.com
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex items-center gap-6"
          style={{ transform: "translateZ(40px)" }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${s.label} profile`}
              data-hover="true"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                fontSize: "10px",
                letterSpacing: "0.15em",
                transition: "all 0.3s ease",
                cursor: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#38bdf8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"; }}
            >
              {s.icon}
              <span>{s.label.toUpperCase()}</span>
            </a>
          ))}
        </motion.div>

      </motion.div>

      {/* Large decorative text */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden" style={{ transform: "translateZ(-120px)" }}>
        <span style={{
          fontSize: "clamp(4rem, 15vw, 11rem)",
          fontWeight: 700,
          letterSpacing: "-0.06em",
          color: "rgba(255,255,255,0.015)",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}>
          CONTACT
        </span>
      </div>
    </motion.div>
  );
});

