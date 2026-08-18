import { useState, useEffect, useContext, memo, useCallback } from "react";
import { motion, AnimatePresence, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";
import { TechnologyChip } from "../TechnologyChip";

// Static imports for Real Evidence Assets
import tiktokUI from "../../../assets/tiktok_ui.png";
import tiktokUI1 from "../../../assets/tiktok_ui1.png";
import tiktokUI2 from "../../../assets/tiktok_ui2.png";
import shop from "../../../assets/shop.JPG";
import shop1 from "../../../assets/shop1.JPG";
import transport from "../../../assets/transport.jpg";
import transport1 from "../../../assets/transport1.jpg";
import transport2 from "../../../assets/transport2.jpg";
import finance from "../../../assets/finance.jpg";
import travel from "../../../assets/travel.JPG";
import travel1 from "../../../assets/travel1.JPG";
import travel2 from "../../../assets/travel2.JPG";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

interface SlideItem {
  type: "image" | "pending";
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  desc?: string;
}

interface MilestoneData {
  step: string;
  year: string;
  title: string;
  subtitle: string;
  detail: string;
  color: string;
  category: string;
  tags: string[];
  evidenceBadge: string;
}

const evidenceByMilestone: Record<number, SlideItem[]> = {
  0: [
    {
      type: "image",
      src: tiktokUI,
      alt: "TikTok UI clone project screenshot",
      title: "TikTok UI Clone",
      subtitle: "Frontend Fundamentals & Layout",
    },
    {
      type: "image",
      src: tiktokUI1,
      alt: "TikTok UI clone project additional screen",
      title: "TikTok UI Clone",
      subtitle: "Frontend Fundamentals & Layout",
    },
    {
      type: "image",
      src: tiktokUI2,
      alt: "TikTok UI clone project additional screen",
      title: "TikTok UI Clone",
      subtitle: "Frontend Fundamentals & Layout",
    },
  ],
  1: [
    {
      type: "image",
      src: shop,
      alt: "Souvenir e-commerce website screenshot",
      title: "Souvenir E-commerce Website",
      subtitle: "PHP / HTML / CSS — Full website implementation",
    },
    {
      type: "image",
      src: shop1,
      alt: "Souvenir e-commerce website additional screen",
      title: "Souvenir E-commerce Website",
      subtitle: "PHP / HTML / CSS — Full website implementation",
    },
  ],
  2: [
    {
      type: "image",
      src: transport,
      alt: "YOLO computer vision traffic accident detection model",
      title: "Traffic Accident Detection",
      subtitle: "Real-Time Object Detection",
    },
    {
      type: "image",
      src: transport1,
      alt: "YOLO helmet violation detection",
      title: "Helmet Violation Model",
      subtitle: "Safety Compliance Vision",
    },
    {
      type: "image",
      src: transport2,
      alt: "YOLO traffic light violation detection",
      title: "Traffic Light Violation",
      subtitle: "Automated Signal Analytics",
    },
  ],
  3: [
    {
      type: "image",
      src: finance,
      alt: "AI-powered personal finance management website",
      title: "AI Personal Finance",
      subtitle: "Income vs Expense Analytics",
    },
  ],
  4: [
    {
      type: "image",
      src: travel,
      alt: "AI-assisted travel application main interface",
      title: "Intelligent Code Assistance",
      subtitle: "Smarter development with AI",
    },
    {
      type: "image",
      src: travel1,
      alt: "AI-assisted travel application details page",
      title: "AI-Driven Analytics",
      subtitle: "Insights that accelerate decisions",
    },
    {
      type: "image",
      src: travel2,
      alt: "AI-assisted travel application booking workflow",
      title: "Beautiful AI-Powered UI",
      subtitle: "Higher quality, better experience",
    },
  ],
};

const milestones: MilestoneData[] = [
  {
    step: "01",
    year: "2022",
    title: "University Begins",
    subtitle: "University of Transport and Communications",
    detail: "Started studying at the University of Transport and Communications. Began learning UI development and took the first steps by building a TikTok UI clone to practice layout, interaction and frontend fundamentals.",
    color: "#38bdf8",
    category: "FRONTEND DEVELOPMENT",
    tags: ["React", "JavaScript", "HTML5", "CSS3"],
    evidenceBadge: "2022 / FRONTEND DEVELOPMENT",
  },
  {
    step: "02",
    year: "2023",
    title: "Souvenir E-commerce Website",
    subtitle: "PHP + HTML + CSS",
    detail: "Built a souvenir e-commerce website from scratch using PHP, HTML and CSS, gaining hands-on experience with web structure, UI implementation and backend-driven web development.",
    color: "#818cf8",
    category: "FULL-STACK WEB DEVELOPMENT",
    tags: ["PHP", "MySQL", "HTML5", "CSS3"],
    evidenceBadge: "2023 / FULL-STACK WEB DEVELOPMENT",
  },
  {
    step: "03",
    year: "2024",
    title: "Entering AI",
    subtitle: "Computer Vision & YOLO",
    detail: "Started exploring Artificial Intelligence and computer vision. Trained a YOLO-based model to detect traffic accidents, helmet violations and traffic-light violations.",
    color: "#a855f7",
    category: "COMPUTER VISION",
    tags: ["Python", "YOLO", "OpenCV", "PyTorch"],
    evidenceBadge: "2024 / YOLO DETECTION",
  },
  {
    step: "04",
    year: "2025",
    title: "AI Meets Web Development",
    subtitle: "AI-Powered Personal Applications",
    detail: "Started integrating AI into personal websites and applications. Built a system that calculates user spending, analyzes the difference between income and expenses, and provides AI assistance for personal expense management.",
    color: "#ec4899",
    category: "AI INTEGRATION",
    tags: ["React", "TypeScript", "Node.js", "OpenAI"],
    evidenceBadge: "2025 / AI EXPENSE ASSISTANT",
  },
  {
    step: "05",
    year: "2026",
    title: "AI-Assisted Engineering",
    subtitle: "Agentic Development Workflow",
    detail: "Started using agent coding tools such as Antigravity, Codex and Claude Code to improve development efficiency. Focused on building higher-quality interfaces and applications with intelligent AI assistance while maintaining engineering quality.",
    color: "#38bdf8",
    category: "AGENTIC WORKFLOW",
    tags: ["Antigravity", "Codex", "Claude Code", "TypeScript", "React"],
    evidenceBadge: "2026 / AGENTIC WORKFLOW",
  },
];

const JOURNEY_METRICS = [
  { icon: "📦", value: "9+", label: "Core Technologies", desc: "Explored & Applied" },
  { icon: "</>", value: "10+", label: "Projects Completed", desc: "Shipped & Operational" },
  { icon: "🎓", value: "3.26", label: "GPA", desc: "Academic Standing" },
  { icon: "⚡", value: "3+", label: "AI Websites", desc: "AI-Powered Products" },
];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function clamp(min: number, max: number, val: number) { return Math.max(min, Math.min(max, val)); }

export const Chapter2 = memo(function Chapter2({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Local scene progress extracted from global motionProgress
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 1)); // i = 1 for Chapter2

  useMotionValueEvent(cp, "change", (latest) => {
    if (latest > 0.05 && !triggered) {
      setTriggered(true);
    }

    const innerProgress = clamp(0, 1, (latest - 0.15) / 0.65);
    const newMilestone = Math.floor(innerProgress * (milestones.length - 0.01));
    if (newMilestone !== activeMilestone) {
      setActiveMilestone(newMilestone);
    }
  });

  // Dedicated effect to securely reset activeSlide when milestone changes
  useEffect(() => {
    setActiveSlide(0);
  }, [activeMilestone]);

  const currentMs = milestones[activeMilestone] || milestones[0];
  const currentEvidence = evidenceByMilestone[activeMilestone] || [];
  const currentSlideItem = currentEvidence[activeSlide] || currentEvidence[0];

  const handleNextSlide = useCallback(() => {
    if (currentEvidence.length > 1) {
      setActiveSlide((prev) => (prev + 1) % currentEvidence.length);
    }
  }, [currentEvidence.length]);

  const handlePrevSlide = useCallback(() => {
    if (currentEvidence.length > 1) {
      setActiveSlide((prev) => (prev - 1 + currentEvidence.length) % currentEvidence.length);
    }
  }, [currentEvidence.length]);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Keyboard navigation listener
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextSlide();
      if (e.key === "ArrowLeft") handlePrevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, handleNextSlide, handlePrevSlide]);

  // Autoplay timer
  useEffect(() => {
    if (!visible || currentEvidence.length <= 1 || isHovered || !isTabVisible) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % currentEvidence.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [visible, currentEvidence.length, isHovered, isTabVisible, activeMilestone]);

  const opacity = useTransform(cp, (v) => {
    if (v < -0.20) return 0;
    if (v < 0.05) return easeOut((v + 0.20) / 0.25);
    if (v <= 0.80) return 1;
    if (v < 0.98) return 1 - easeOut((v - 0.80) / 0.18);
    return 0;
  });

  const translateY = useTransform(cp, (v) => {
    if (v < 0.05) return (1 - easeOut((v + 0.20) / 0.25)) * 24;
    if (v > 0.80) return -easeOut((v - 0.80) / 0.18) * 24;
    return 0;
  });

  const scale = useTransform(cp, (v) => {
    if (v < 0.05) return 0.985 + easeOut((v + 0.20) / 0.25) * 0.015;
    if (v > 0.80) return 1 - easeOut((v - 0.80) / 0.18) * 0.015;
    return 1;
  });

  const pointerEvents = useTransform(cp, (v) => (v >= -0.05 && v <= 0.85 ? "auto" : "none"));

  const lineProgress = useTransform(cp, (v) => clamp(0, 1, (v - 0.10) / 0.70));
  const lineHeight = useTransform(lineProgress, (v) => `${v * 100}%`);

  // 3D Spatial Depth MotionValues
  const rotateX = useTransform(cp, (v) => v * -4);
  const rotateY = useTransform(cp, () => mouse.x * 3);

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
        willChange: "transform, opacity",
      }}
    >
      {/* Ambient background radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 65% 65% at ${30 + mouse.x * 10}% ${40 + mouse.y * 8}%, rgba(56,189,248,0.05) 0%, rgba(168,85,247,0.03) 45%, transparent 75%)`,
        transition: "background 0.2s ease",
      }} />

      {/* Grid backdrop texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }} />

      {/* TOP HEADER BAR */}
      <div className="relative z-20 flex items-center justify-between w-full pt-2" style={{ transform: "translateZ(30px)" }}>
        {/* Top Left: Chapter Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/70 uppercase">
            CHAPTER 02 / JOURNEY
          </span>
        </div>

        {/* Top Right: Step Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/40">
            02 — JOURNEY
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* GIANT BACKGROUND YEAR WATERMARK (Spans deep negative Z behind center and right) */}
      <div
        className="absolute right-4 sm:right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden z-0"
        style={{ transform: "translateY(-50%) translateZ(-120px)", transformStyle: "preserve-3d" }}
      >
        <span
          className="text-[16rem] sm:text-[22rem] md:text-[28rem] font-extrabold font-mono tracking-tighter block text-transparent opacity-10"
          style={{
            WebkitTextStroke: `1.5px ${currentMs.color}`,
            textShadow: `0 0 100px ${currentMs.color}20`,
            transition: "all 0.6s cubic-bezier(0.33,1,0.68,1)",
          }}
        >
          {currentMs.year}
        </span>
      </div>

      {/* MAIN 3-ZONE COMPOSITION GRID (Flat Grid: Decouples Evidence from 3D subtrees) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full max-w-7xl mx-auto my-auto py-2">
        {/* LEFT SPATIAL TIMELINE NAVIGATION RAIL (lg:col-span-2, ~15%) */}
        <motion.div
          className="lg:col-span-2 hidden md:flex flex-col justify-between relative pl-1"
          style={{
            height: "clamp(300px, 50vh, 440px)",
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Track line (centered at left 15px) */}
          <div className="absolute left-[15px] inset-y-0 w-[1px] bg-white/10" />
          
          {/* Animated line fill */}
          <motion.div
            className="absolute left-[15px] top-0 w-[1px]"
            style={{
              height: lineHeight,
              background: `linear-gradient(180deg, ${milestones[0].color}, ${currentMs.color})`,
              boxShadow: `0 0 12px ${currentMs.color}aa`,
              transition: "background 0.4s ease",
            }}
          />

          {/* Timeline node rows */}
          {milestones.map((m, i) => {
            const isActive = i <= activeMilestone;
            const isCurrent = i === activeMilestone;
            return (
              <div
                key={m.year}
                className="flex items-center gap-3.5 relative z-10 cursor-pointer"
                onClick={() => {
                  setActiveMilestone(i);
                }}
                style={{
                  transform: `translateZ(${isCurrent ? "25px" : "0px"})`,
                  transition: "transform 0.4s ease",
                }}
              >
                {/* Node Circle centered on axis line */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0"
                  style={{
                    background: isCurrent ? `${m.color}30` : "rgba(15,23,42,0.9)",
                    border: isCurrent ? `2px solid ${m.color}` : isActive ? `1px solid ${m.color}88` : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: isCurrent ? `0 0 20px ${m.color}cc, inset 0 0 10px ${m.color}55` : "none",
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      background: isActive ? m.color : "rgba(255,255,255,0.25)",
                      boxShadow: isCurrent ? `0 0 10px ${m.color}` : "none",
                    }}
                  />
                </div>

                {/* Step & Year Label */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-white/30 tracking-widest">{m.step}</span>
                  <span
                    className="text-xs font-mono font-bold tracking-wider transition-colors duration-400"
                    style={{ color: isCurrent ? m.color : isActive ? "#ffffff" : "rgba(255,255,255,0.35)" }}
                  >
                    {m.year}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CENTER MAIN JOURNEY NARRATIVE (lg:col-span-5, ~42%) — Spatial Narrative Layout */}
        <motion.div
          className="lg:col-span-5 flex flex-col items-start text-left"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Category Badge */}
          <div className="px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-3">
            MY JOURNEY
          </div>

          {/* Large Hero Year Title */}
          <motion.div
            key={currentMs.year}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight mb-2"
            style={{
              background: `linear-gradient(135deg, ${currentMs.color}, #ffffff)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {currentMs.year}
          </motion.div>

          {/* Primary Title */}
          <motion.h2
            key={`title-${currentMs.year}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-1"
          >
            {currentMs.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.div
            key={`sub-${currentMs.year}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: currentMs.color }}
          >
            {currentMs.subtitle}
          </motion.div>

          {/* Glowing Accent Line */}
          <div
            className="w-16 h-[2px] mb-4 rounded-full"
            style={{
              background: currentMs.color,
              boxShadow: `0 0 10px ${currentMs.color}`,
            }}
          />

          {/* Description Paragraph */}
          <motion.p
            key={`detail-${currentMs.year}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xl mb-6 font-light tracking-wide"
          >
            {currentMs.detail}
          </motion.p>

          {/* PROMINENT TECHNOLOGY CHIPS */}
          <motion.div
            key={`tags-${currentMs.year}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap gap-2.5"
          >
            {currentMs.tags.map((tag) => (
              <TechnologyChip
                key={tag}
                name={tag}
                size="md"
                className="hover:scale-105"
              />
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT EVIDENCE SHOWCASE (lg:col-span-5, ~43%) — CRISP 2D POSTER + AMBIENT 3D BACKDROP */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="lg:col-span-5 flex flex-col w-full relative EvidenceScene"
        >
          {/* DECORATIVE 3D BACKGROUND LAYER (Aura & Orbital lines) */}
          <div className="absolute inset-0 pointer-events-none Decorative3DLayer" style={{ transform: "translateZ(-20px)" }}>
            {/* Ambient Radial Energy Aura */}
            <div className="absolute -inset-6 rounded-[50px] bg-radial from-sky-500/10 via-purple-500/5 to-transparent opacity-50 blur-2xl" />

            {/* SVG Orbital Energy Arcs */}
            <svg className="absolute -inset-12 w-[125%] h-[125%] opacity-20 z-0">
              <ellipse cx="50%" cy="40%" rx="48%" ry="38%" fill="none" stroke="url(#spatialOrbitalGradient)" strokeWidth="1.5" strokeDasharray="6 6" />
              <defs>
                <linearGradient id="spatialOrbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 1. MINIMAL METADATA HEADER (Stable 2D Header) */}
          <div className="flex items-center justify-between w-full pb-1.5 relative z-20">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold text-[10px]">✦</span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase">
                {currentMs.evidenceBadge}
              </span>
            </div>
            
            {/* Minimal Slide Controls */}
            {currentEvidence.length > 1 ? (
              <div className="flex items-center gap-3">
                <button onClick={handlePrevSlide} aria-label="Previous" className="text-white/30 hover:text-white transition-colors cursor-pointer text-xs">◄</button>
                <span className="text-[9px] font-mono text-sky-400/80 tracking-widest uppercase">
                  0{activeSlide + 1} / 0{currentEvidence.length}
                </span>
                <button onClick={handleNextSlide} aria-label="Next" className="text-white/30 hover:text-white transition-colors cursor-pointer text-xs">►</button>
              </div>
            ) : (
              <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">REAL PROJECT EVIDENCE</span>
            )}
          </div>
          
          <div className="w-full h-[1px] bg-gradient-to-r from-sky-400/30 to-transparent mb-5 relative z-20" />

          {/* 2. STABLE CRISP 2D MAIN SCREENSHOT (CrispImageLayer: 100% Visual Mass, Native Resolution, No 3D Blur) */}
          <div
            className="relative w-full z-10 CrispImageLayer"
            style={{
              transform: "none",
              transformStyle: "flat",
            }}
          >
            <AnimatePresence mode="wait">
              {currentSlideItem.type === "image" ? (
                <motion.div
                  key={`${currentMs.year}-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl shadow-2xl border border-white/10 bg-slate-950/20 overflow-hidden EvidenceImageFrame"
                  style={{
                    transform: "none",
                    transformStyle: "flat",
                  }}
                >
                  <img
                    src={currentSlideItem.src}
                    alt={currentSlideItem.alt}
                    className="w-full h-auto block select-none"
                    style={{
                      transform: "none",
                      filter: "none",
                      willChange: "auto",
                      imageRendering: "auto",
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`${currentMs.year}-pending`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full aspect-video bg-slate-950/85 border border-purple-500/30 flex flex-col items-center justify-center text-center p-6 space-y-3 rounded-xl"
                  style={{
                    transform: "none",
                    transformStyle: "flat",
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-300 text-2xl shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                    🕒
                  </div>
                  <span className="text-sm font-mono font-bold tracking-widest text-white/90 uppercase">
                    {currentSlideItem.title}
                  </span>
                  <span className="text-xs text-white/50 font-mono tracking-wide max-w-xs">
                    {currentSlideItem.desc}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. SUPPORTING THUMBNAILS (ONLY RENDERED IF MULTIPLE SLIDES) */}
          {currentEvidence.length > 1 && (
            <div className="flex justify-end gap-2.5 mt-4 relative z-20 w-full">
              {currentEvidence.map((s, idx) => {
                const isCurrent = idx === activeSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Thumbnail ${idx + 1}`}
                    className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden transition-all duration-300 border cursor-pointer"
                    style={{
                      borderColor: isCurrent ? "rgba(56,189,248,0.7)" : "rgba(255,255,255,0.1)",
                      opacity: isCurrent ? 1 : 0.4,
                      transform: isCurrent ? "scale(1.05)" : "scale(1)",
                      boxShadow: isCurrent ? "0 4px 12px rgba(56,189,248,0.25)" : "none",
                    }}
                  >
                    {s.type === "image" ? (
                      <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px]">🕒</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM LIGHTWEIGHT JOURNEY METRICS PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={triggered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-20 w-full max-w-7xl mx-auto mt-2"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          {JOURNEY_METRICS.map((m) => (
            <div key={m.label} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center text-xl shrink-0">
                {m.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold text-white font-mono tracking-tight leading-tight">{m.value}</span>
                <span className="text-xs font-semibold text-white/90 tracking-wide truncate">{m.label}</span>
                <span className="text-[9px] text-white/40 tracking-wider truncate">{m.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});








