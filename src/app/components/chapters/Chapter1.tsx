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
  { icon: "</>", label: "Clean Code" },
  { icon: "✦", label: "Problem Solver" },
  { icon: "🧠", label: "AI Enthusiast" },
  { icon: "🚀", label: "Always Learning" },
];

const STATS = [
  { icon: "💼", value: "15+", label: "Projects" },
  { icon: "💻", value: "3+", label: "Years Coding" },
  { icon: "🥞", value: "9+", label: "Technologies" },
  { icon: "❤️", value: "∞", label: "Passion" },
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
    const exiting = v > 0.75;
    return exiting ? 1 - easeOut((v - 0.75) / 0.25) : 1;
  });

  const scale = useTransform(cp, (v) => (v > 0.75 ? 1 - ((v - 0.75) / 0.25) * 0.08 : 1));

  const translateY = useTransform(cp, (v) => {
    const exiting = v > 0.75;
    return exiting ? -((v - 0.75) / 0.25) * 30 : 0;
  });

  // 3D Spatial Depth MotionValues
  const rotateX = useTransform(cp, (v) => (v > 0 ? -v * 8 : 0));
  const rotateY = useTransform(cp, () => mouse.x * 4.5);

  const parallaxX = mouse.x * 10;
  const parallaxY = mouse.y * 6;

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden px-6 md:px-12 lg:px-16 py-6"
      style={{
        opacity,
        scale,
        y: translateY,
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Mouse parallax ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 650px at ${50 + mouse.x * 15}% ${50 + mouse.y * 12}%, rgba(56,189,248,0.08) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)`,
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

      {/* TOP HEADER BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex items-center justify-between w-full pt-2"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Top Left: Chapter Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/70 uppercase">
            CHAPTER 01 / INTRODUCTION
          </span>
        </div>

        {/* Top Right: Social Icons Bar & Download CV Button */}
        <div className="flex items-center gap-3">
          {/* Social icons pill */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              data-hover="true"
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
              data-hover="true"
              className="text-white/50 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="mailto:tranhuutrunghieu@example.com"
              aria-label="Send Email"
              data-hover="true"
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
            data-hover="true"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-pink-500/15 border border-cyan-400/40 text-cyan-300 text-[11px] font-medium tracking-wider hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
          >
            <span>Download CV</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </motion.div>

      {/* MAIN 2-COLUMN HERO CONTENT */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-7xl mx-auto my-auto py-2">
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
            className="flex items-center gap-2 mb-3.5"
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
            className="mb-3.5"
            style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              TRAN HUU <br />
              <span className="text-white/90">TRUNG HIEU</span>
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
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-[0.22em] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
              AI FULL STACK DEVELOPER
            </span>
          </motion.div>

          {/* Positioning Statement */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-white/60 text-sm sm:text-base leading-relaxed max-w-xl mb-7 font-light tracking-wide"
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
              data-hover="true"
              onClick={() => {
                const el = document.getElementById("chapter-3");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>View My Work</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Secondary CTA */}
            <button
              data-hover="true"
              onClick={() => {
                const el = document.getElementById("chapter-7");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-white/80 font-medium text-xs tracking-widest uppercase hover:bg-white/[0.08] hover:border-white/30 hover:text-white transition-all cursor-pointer"
            >
              <span>Contact Me</span>
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </motion.div>

          {/* Feature Badges Row */}
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-white/70 text-[11px] tracking-wider backdrop-blur-sm"
              >
                <span className="text-cyan-400 font-mono font-bold">{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: REAL AVATAR & STATS DASHBOARD CARD (5 cols on lg) */}
        <motion.div
          className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0"
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
            {/* 1. REAL AVATAR HERO CONTAINER */}
            {/* ========================================================================= */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-6" style={{ transformStyle: "preserve-3d" }}>
              {/* Subtle Ambient Orbital Lines Behind Avatar */}
              <div
                className="absolute inset-0 rounded-full border border-cyan-400/20 border-dashed animate-[spin_26s_linear_infinite] pointer-events-none"
                style={{ transform: "rotateX(65deg) rotateY(15deg) translateZ(-20px)" }}
              />
              <div
                className="absolute inset-[-14px] rounded-full border border-purple-500/20 border-dashed animate-[spin_34s_linear_infinite_reverse] pointer-events-none"
                style={{ transform: "rotateX(45deg) rotateY(-25deg) translateZ(-35px)" }}
              />

              {/* Glowing Rim Glass Avatar Frame */}
              <div
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-purple-500/30 border border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.28)] flex items-center justify-center relative overflow-hidden backdrop-blur-md"
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

            {/* ========================================================================= */}
            {/* 2. STATS & AVAILABILITY CARD */}
            {/* ========================================================================= */}
            <div
              className="w-full max-w-md p-5 rounded-2xl bg-[#070f1e]/85 border border-cyan-500/20 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative z-10"
              style={{ transform: "translateZ(45px)" }}
            >
              {/* Card Header: Location & Availability status */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-white/75">
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Viet Nam</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#22c55e]" />
                  <span className="text-emerald-400 font-medium tracking-wide text-[11px]">Available for work</span>
                </div>
              </div>

              {/* 4 Metric Columns */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <span className="text-xs mb-1 opacity-70">{s.icon}</span>
                    <span className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">{s.value}</span>
                    <span className="text-[10px] text-white/50 tracking-wider mt-0.5">{s.label}</span>
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
        className="relative z-20 flex flex-col items-center justify-center pb-2 pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Mouse Icon */}
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1 mb-1.5">
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
        </div>
        <span className="text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
          SCROLL TO EXPLORE
        </span>
        <svg className="w-3.5 h-3.5 text-white/30 mt-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.div>
  );
});
