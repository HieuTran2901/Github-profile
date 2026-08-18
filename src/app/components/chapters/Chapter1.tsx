import { useContext, useEffect, useState, memo } from "react";
import { motion, useTransform } from "motion/react";
import { MotionCtx } from "../../App";
import avatar from "../../../assets/avatar.png";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const BADGES = [
  { icon: "</>", label: "Clean Code", color: "text-cyan-400" },
  { icon: "✦", label: "Problem Solver", color: "text-purple-400" },
  { icon: "🧠", label: "AI Enthusiast", color: "text-pink-400" },
  { icon: "🚀", label: "Always Learning", color: "text-amber-400" },
];

const STATS = [
  {
    icon: (
      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    value: "10+",
    title: "Projects",
    sub: "Completed",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    value: "3+",
    title: "Years Coding",
    sub: "Experience",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    value: "9+",
    title: "Technologies",
    sub: "Core Stack",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    value: "∞",
    title: "Passion",
    sub: "For Building",
  },
];

export const Chapter1 = memo(function Chapter1({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => {
    return Math.max(-0.5, Math.min(1.5, v - 0)); // i = 0 for Chapter1
  });

  const opacity = useTransform(cp, (v) => {
    const exiting = v > 0.70;
    return exiting ? 1 - easeOut((v - 0.70) / 0.30) : 1;
  });

  const scale = useTransform(cp, (v) => {
    const exiting = v > 0.70;
    return exiting ? 1 - easeOut((v - 0.70) / 0.30) * 0.015 : 1;
  });

  const translateY = useTransform(cp, (v) => {
    const exiting = v > 0.70;
    return exiting ? -easeOut((v - 0.70) / 0.30) * 24 : 0;
  });

  const pointerEvents = useTransform(cp, (v) => (v <= 0.85 ? "auto" : "none"));

  // 3D Spatial Depth MotionValues
  const rotateX = useTransform(cp, (v) => (v > 0 ? -v * 8 : 0));
  const rotateY = useTransform(cp, () => mouse.x * 4.5);

  const parallaxX = mouse.x * 10;
  const parallaxY = mouse.y * 6;

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden px-6 md:px-12 lg:px-16 py-6 select-none"
      style={{
        opacity,
        scale,
        y: translateY,
        pointerEvents,
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 700px at ${50 + mouse.x * 15}% ${50 + mouse.y * 12}%, rgba(56,189,248,0.09) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)`,
          transition: "background 0.2s ease",
        }}
      />

      {/* Grid backdrop texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex items-center justify-between w-full pt-1"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Top Left: Chapter Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
            CHAPTER 01 / INTRODUCTION
          </span>
        </div>

        {/* Top Right: Social Icons Bar & Download CV Button */}
        <div className="flex items-center gap-3">
          {/* Social icons pill */}
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md">
            <a
              href="https://github.com/HieuTran2901"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-white/50 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-white/50 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="mailto:trunghieu10a1thptll@gmail.com"
              aria-label="Send Email"
              className="text-white/50 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>

          {/* Download CV button */}
          <a
            href="#contact"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
          >
            <span>Download CV</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN HERO CONTENT */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto my-auto py-2">
        {/* LEFT COLUMN: IDENTITY & CONTENT (7 cols on lg) */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-start text-left"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            transform: `translate(${parallaxX * 0.4}px, ${parallaxY * 0.3}px)`,
          }}
        >
          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-2 mb-3"
            style={{ transform: "translateZ(20px)" }}
          >
            <span className="text-sm">👋</span>
            <span className="text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase font-semibold">
              HELLO, MY NAME IS
            </span>
          </motion.div>

          {/* Large Name Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3"
            style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              TRAN HUU <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500">
                TRUNG HIEU
              </span>
            </h1>
          </motion.div>

          {/* Role Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mb-4"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-[0.22em] text-white/90 uppercase">
              AI FULL STACK DEVELOPER
            </span>
          </motion.div>

          {/* Positioning Statement */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-white/65 text-sm sm:text-base leading-relaxed max-w-xl mb-7 font-light tracking-wide"
            style={{ transform: "translateZ(30px)" }}
          >
            I build intelligent, scalable and high-performance web applications with modern technologies and AI integration.
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4 mb-7"
            style={{ transform: "translateZ(50px)" }}
          >
            {/* Primary CTA */}
            <button
              onClick={() => {
                const el = document.getElementById("chapter-3");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>View My Work</span>
              <span className="text-sm">➔</span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => {
                const el = document.getElementById("chapter-7");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950/70 border border-white/15 text-white/90 font-bold text-xs tracking-wider uppercase hover:bg-slate-900/90 hover:border-white/30 hover:text-white transition-all cursor-pointer"
            >
              <span>Contact Me</span>
              <span className="text-sm">💬</span>
            </button>
          </motion.div>

          {/* Capability Tags Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="flex flex-wrap gap-2.5"
            style={{ transform: "translateZ(25px)" }}
          >
            {BADGES.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/10 text-white/75 text-[11px] tracking-wider backdrop-blur-sm shadow-sm"
              >
                <span className={`${b.color} font-mono font-bold`}>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: REAL AVATAR & STATS DASHBOARD CARD (5 cols on lg) */}
        <motion.div
          className="lg:col-span-5 flex flex-col items-center justify-center relative mt-4 lg:mt-0"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            x: -parallaxX * 0.3,
            y: -parallaxY * 0.2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col items-center justify-center relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ========================================================================= */}
            {/* AVATAR HERO CONTAINER WITH 3D ORBITAL RINGS */}
            {/* ========================================================================= */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-4" style={{ transformStyle: "preserve-3d" }}>
              {/* Tilted Elliptical Orbit Ring with Glowing Nodes */}
              <div
                className="absolute inset-[-18px] rounded-full border border-cyan-400/25 pointer-events-none"
                style={{
                  transform: "rotateX(68deg) rotateY(18deg) translateZ(-15px)",
                  boxShadow: "0 0 35px rgba(34,211,238,0.2)",
                }}
              >
                {/* Glowing Nodes along the orbit */}
                <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
                <div className="absolute bottom-4 right-8 w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_#c084fc]" />
                <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_#38bdf8]" />
              </div>

              {/* Secondary faint outer orbit */}
              <div
                className="absolute inset-[-32px] rounded-full border border-purple-500/15 pointer-events-none"
                style={{
                  transform: "rotateX(72deg) rotateY(-12deg) translateZ(-25px)",
                }}
              />

              {/* Vibrant Gradient Rim Glass Avatar Frame */}
              <div
                className="w-52 h-52 sm:w-60 sm:h-60 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-sky-500 to-purple-500 shadow-[0_0_50px_rgba(34,211,238,0.35),0_0_80px_rgba(168,85,247,0.25)] flex items-center justify-center relative overflow-hidden backdrop-blur-md"
                style={{ transform: "translateZ(30px)" }}
              >
                {/* Real Person Avatar Image */}
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900/90 relative">
                  <img
                    src={avatar}
                    alt="Tran Huu Trung Hieu"
                    className="w-full h-full object-cover object-top select-none"
                  />
                </div>
              </div>
            </div>

            {/* Location & Availability Row */}
            <div className="flex items-center justify-between w-full max-w-md px-2 mb-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-white/70 font-mono">
                <span className="text-cyan-400">📍</span>
                <span>Viet Nam, GMT+7</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-emerald-400 font-mono font-medium tracking-wide text-[11px]">
                  Available for work
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STATS DASHBOARD CARD (Clean 4-column layout matching reference) */}
            {/* ========================================================================= */}
            <div
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative z-10"
              style={{ transform: "translateZ(45px)" }}
            >
              <div className="grid grid-cols-4 divide-x divide-white/10 text-center">
                {STATS.map((s, idx) => (
                  <div key={idx} className={`flex flex-col items-center ${idx > 0 ? "pl-2" : ""} ${idx < 3 ? "pr-2" : ""}`}>
                    <div className="mb-1">{s.icon}</div>
                    <span className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight leading-tight">
                      {s.value}
                    </span>
                    <span className="text-[10px] text-white/75 font-medium tracking-tight mt-0.5">
                      {s.title}
                    </span>
                    <span className="text-[8px] text-white/40 tracking-wider">
                      {s.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM SCROLL CUE (Single, uncluttered) */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
        className="relative z-20 flex flex-col items-center justify-center pb-1 pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Mouse Icon */}
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1 mb-1">
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
        </div>
        <span className="text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
          SCROLL TO EXPLORE
        </span>
        <svg className="w-3.5 h-3.5 text-white/30 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.div>
  );
});
