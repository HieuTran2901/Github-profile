import { useState, useContext, memo } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";
import travelEvidence from "../../../assets/travel2.JPG";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const verifiedFacts = [
  {
    icon: "🚀",
    title: "PRODUCTION",
    subtitle: "Deployment Status",
    desc: "Active production deployment",
    accent: "text-cyan-400",
  },
  {
    icon: "🤖",
    title: "AI / LLM",
    subtitle: "Recommendation Layer",
    desc: "Intelligent concierge & itineraries",
    accent: "text-purple-400",
  },
  {
    icon: "🧩",
    title: "MICROSERVICES",
    subtitle: "Distributed Architecture",
    desc: "Decoupled domain services",
    accent: "text-sky-400",
  },
  {
    icon: "💻",
    title: "FULL STACK",
    subtitle: "Java + Spring + React",
    desc: "Modern reactive frontend & backend",
    accent: "text-emerald-400",
  },
];

const techStack = [
  { name: "Java", icon: "☕" },
  { name: "Spring Boot", icon: "🌱" },
  { name: "React", icon: "⚛️" },
  { name: "TypeScript", icon: "TS" },
  { name: "OpenAI", icon: "🤖" },
  { name: "AWS", icon: "☁️" },
  { name: "Docker", icon: "🐳" },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

export const Chapter4 = memo(function Chapter4({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);

  // Local scene progress extracted from global motionProgress (Chapter 4 = index 3)
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 3));

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

  // 3D Parallax Depth MotionValues
  const mockupRotateX = useTransform(cp, (v) => (v > 0 ? -v * 4 : 0) - mouse.y * 5);
  const mockupRotateY = useTransform(cp, () => mouse.x * 6);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden px-6 md:px-12 lg:px-16 py-6 select-none"
      style={{
        opacity,
        y: translateY,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 55% at ${60 + mouse.x * 12}% ${50 + mouse.y * 10}%, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.5) 60%, #030712 100%)`,
          transition: "background 0.2s ease",
        }}
      />

      {/* Grid backdrop texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex items-center justify-between w-full pt-1">
        {/* Top Left: Chapter Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
            CHAPTER 04 / FEATURED PROJECT
          </span>
        </div>

        {/* Top Right: Step indicator */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
            04 — SHOWCASE
          </span>
          <span className="text-cyan-400 text-xs">➔</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN FEATURED SHOWCASE STAGE */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto my-auto py-2">
        {/* LEFT COLUMN: PROJECT INFORMATION & VERIFIED FACTS (5 cols on lg) */}
        <motion.div
          className="lg:col-span-5 flex flex-col items-start text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={triggered ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          {/* Subtitle Pill */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              FEATURED PROJECT
            </span>
            <span className="text-[11px] font-mono tracking-wider text-white/60">
              Full Stack · AI
            </span>
          </div>

          {/* Large Project Title */}
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-[1.05]">
            AI Travel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500">
              Marketplace
            </span>
          </h2>

          {/* Concise Factual Description */}
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg mb-4 font-light tracking-wide">
            An AI-powered travel marketplace combining intelligent recommendations, real-time travel workflows, and distributed backend services.
          </p>

          {/* Verified Technology Badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-white/80 text-[10px] font-mono tracking-wide backdrop-blur-md shadow-sm flex items-center gap-1.5"
              >
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </span>
            ))}
          </div>

          {/* 4 Compact Verified Project Fact Cards (Replacing unverified metrics) */}
          <div className="grid grid-cols-2 gap-2.5 w-full mb-6">
            {verifiedFacts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md shadow-sm flex flex-col justify-between hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{fact.icon}</span>
                  <span className={`text-[11px] font-bold font-mono tracking-wide ${fact.accent}`}>
                    {fact.title}
                  </span>
                </div>
                <span className="text-[10px] text-white/80 font-medium tracking-tight">
                  {fact.subtitle}
                </span>
                <span className="text-[9px] text-white/45 tracking-wider mt-0.5">
                  {fact.desc}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>VIEW REPOSITORY</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById("chapter-5");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950/70 border border-white/15 text-white/90 font-bold text-xs tracking-wider uppercase hover:bg-slate-900/90 hover:border-white/30 hover:text-white transition-all cursor-pointer"
            >
              <span>EXPLORE ALL PROJECTS</span>
              <span className="text-sm">➔</span>
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: REAL PROJECT EVIDENCE SCREENSHOT (7 cols on lg) */}
        <motion.div
          className="lg:col-span-7 flex items-center justify-center relative mt-4 lg:mt-0"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={triggered ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            rotateX: mockupRotateX,
            rotateY: mockupRotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Real Project Evidence Card Frame */}
          <div
            className="w-full rounded-2xl overflow-hidden bg-[#070f1e]/90 border border-cyan-400/40 shadow-[0_20px_70px_rgba(0,180,255,0.25),0_30px_90px_rgba(0,0,0,0.8)] backdrop-blur-xl relative"
            style={{ transform: "translateZ(40px)" }}
          >
            {/* Subtle Browser / Application Top Bar */}
            <div className="h-9 px-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-white/40 ml-2">
                  travel-marketplace.ai/explore
                </span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400/70 font-semibold uppercase tracking-wider">
                LIVE PRODUCTION
              </span>
            </div>

            {/* Crisp 2D Real Project Screenshot Container */}
            <div className="w-full bg-slate-950/80 p-2 sm:p-3 flex items-center justify-center">
              <img
                src={travelEvidence}
                alt="AI Travel Marketplace project interface"
                className="w-full h-auto max-h-[55vh] object-contain rounded-lg shadow-md select-none"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM SCROLL CUE */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center pb-1 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase">
          SCROLL TO EXPLORE ORBIT
        </span>
        <svg className="w-3.5 h-3.5 text-white/30 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </motion.div>
  );
});
