import { useState, useContext, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValueEvent, useSpring } from "motion/react";
import type { MotionValue } from "motion/react";
import { MotionCtx } from "../../App";
import { TechnologyChip } from "../TechnologyChip";
import asp from "../../../assets/projects/ai-study-planner/ASP.PNG";
import asp1 from "../../../assets/projects/ai-study-planner/ASP1.PNG";
import asp2 from "../../../assets/projects/ai-study-planner/ASP2.PNG";
import asp3 from "../../../assets/projects/ai-study-planner/ASP3.PNG";
import asp4 from "../../../assets/projects/ai-study-planner/ASP4.PNG";

import avt from "../../../assets/projects/ai-travel-marketplace/AVT.PNG";
import avt1 from "../../../assets/projects/ai-travel-marketplace/AVT1.PNG";
import avt2 from "../../../assets/projects/ai-travel-marketplace/AVT2.PNG";
import avt3 from "../../../assets/projects/ai-travel-marketplace/AVT3.PNG";

import pho1 from "../../../assets/projects/pho-viet-1986/PHO1.PNG";
import pho2 from "../../../assets/projects/pho-viet-1986/PHO2.PNG";
import pho3 from "../../../assets/projects/pho-viet-1986/PHO3.PNG";
import pho4 from "../../../assets/projects/pho-viet-1986/PHO4.PNG";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

interface StoryProject {
  id: string;
  index: number;
  numberStr: string;
  date: string;
  year: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  category: string;
  status: string;
  systemIdentity: string;
  systemCharacteristics: string[];
  description: string;
  role: string;
  technologies: string[];
  heroImage: string;
  detailImages: string[];
  accent: string;
  accentGlow: string;
}

const projects: StoryProject[] = [
  {
    id: "studyplan",
    index: 0,
    numberStr: "01",
    date: "29.03.2026",
    year: "2026",
    title: "AI Study Planner",
    titleAccent: "Planner",
    subtitle: "AI-Powered Study & Workflow Planning",
    category: "Frontend · Full Stack · AI",
    status: "PRODUCTION",
    systemIdentity: "AI-ASSISTED LEARNING PLATFORM",
    systemCharacteristics: ["AI / PLANNING", "SCHEDULE OPTIMIZATION", "PERSONALIZED WORKFLOW"],
    description:
      "AI-powered study planning platform for organizing learning goals, schedules, progress, and personalized study workflows.",
    role: "Full-Stack Developer",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Spring Boot",
      "Java",
    ],
    heroImage: asp,
    detailImages: [asp, asp1, asp2, asp3, asp4],
    accent: "#38bdf8",
    accentGlow: "rgba(56, 189, 248, 0.4)",
  },
  {
    id: "travel",
    index: 1,
    numberStr: "02",
    date: "03.07.2026",
    year: "2026",
    title: "AI Travel Marketplace",
    titleAccent: "Marketplace",
    subtitle: "Intelligent Travel & Booking Platform",
    category: "Full Stack · AI",
    status: "PRODUCTION",
    systemIdentity: "AI-POWERED TRAVEL ECOSYSTEM",
    systemCharacteristics: ["GEMINI & GROQ AI", "MOMO & SEPAY PAYMENTS", "RAILWAY & MYSQL"],
    description:
      "AI-powered travel marketplace combining multi-LLM recommendations (Gemini & Groq), real-time itinerary planning, MoMo/SePay payment flows, and scalable Spring Boot services.",
    role: "Lead Developer",
    technologies: [
      "Java",
      "Spring Boot",
      "React",
      "TypeScript",
      "MySQL",
      "Tailwind CSS",
      "OpenAI",
      "Vite",
    ],
    heroImage: avt,
    detailImages: [avt, avt1, avt2, avt3],
    accent: "#00d2ff",
    accentGlow: "rgba(0, 210, 255, 0.4)",
  },
  {
    id: "pho1986",
    index: 2,
    numberStr: "03",
    date: "13.09.2026",
    year: "2026",
    title: "Phở Gia Truyền 1986",
    titleAccent: "1986",
    subtitle: "Heritage Culinary & Smart Booking Platform",
    category: "Full Stack · AI Concierge",
    status: "PRODUCTION",
    systemIdentity: "HERITAGE CULINARY ECOSYSTEM",
    systemCharacteristics: ["VIETQR / SEPAY AUTOMATION", "GEMINI AI CONCIERGE", "SPRING BOOT & REACT"],
    description:
      "Enterprise culinary heritage marketplace featuring personalized taste customization, 3-step table reservations, zero-trust Napas 247/SePay QR auto-verification, Gemini AI assistant, and admin CRM portal.",
    role: "Full-Stack Engineer",
    technologies: [
      "Java",
      "Spring Boot",
      "React",
      "Tailwind CSS",
      "MySQL",
      "SePay / MoMo",
      "OpenAI",
      "Vite",
    ],
    heroImage: pho1,
    detailImages: [pho1, pho2, pho3, pho4],
    accent: "#f59e0b",
    accentGlow: "rgba(245, 158, 11, 0.4)",
  },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

// =========================================================================
const SCREENSHOT_SLIDE_INTERVAL = 4000;

// =========================================================================
// HIGH-FIDELITY ORBITAL PROJECT CARD (V2: 2:1 Natural Media Frame & Sharp 2D Surface)
// =========================================================================
const OrbitProjectCard = memo(function OrbitProjectCard({
  proj,
  index,
  projectProgress,
  activeProject,
  activeImageIndex,
  onSelectImageIndex,
  onSelect,
  onMediaHover,
}: {
  proj: StoryProject;
  index: number;
  projectProgress: MotionValue<number>;
  activeProject: number;
  activeImageIndex: number;
  onSelectImageIndex: (idx: number) => void;
  onSelect: (idx: number) => void;
  onMediaHover: (hovered: boolean) => void;
}) {
  const x = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return Math.sin(rel * (Math.PI / 2.5)) * 740;
  });

  const z = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return 140 - Math.abs(rel) * 160;
  });

  const scale = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    const absRel = Math.min(1.5, Math.abs(rel));
    return 1.0 - absRel * 0.16;
  });

  const rotateY = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return -rel * 14;
  });

  const opacity = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    const absRel = Math.min(1.5, Math.abs(rel));
    return 1.0 - absRel * 0.50;
  });

  const isActive = index === activeProject;
  const currentImageSrc = proj.detailImages[activeImageIndex] || proj.heroImage;

  return (
    <motion.div
      onClick={() => onSelect(index)}
      style={{
        x,
        z,
        scale,
        rotateY,
        opacity,
        zIndex: isActive ? 30 : 10,
        transformStyle: isActive ? "flat" : "preserve-3d",
      }}
      className={`absolute rounded-2xl overflow-hidden transition-all cursor-pointer select-none ${
        isActive
          ? "w-[96%] sm:w-[920px] md:w-[1000px] lg:w-[1080px] bg-[#070f1e] border border-cyan-400/50 shadow-[0_20px_80px_rgba(0,180,255,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] p-4 sm:p-5"
          : "w-[320px] sm:w-[380px] md:w-[420px] h-[320px] sm:h-[360px] bg-[#050c18]/85 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-4"
      }`}
    >
      {isActive ? (
        /* ================= ACTIVE CENTER HERO CARD ================= */
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 items-stretch">
          {/* Left Media Column (~64% width): Natural screenshot aspect ratio with auto-slider */}
          <div
            className="w-full sm:w-[63%] md:w-[65%] flex flex-col gap-2.5"
            onMouseEnter={() => onMediaHover(true)}
            onMouseLeave={() => onMediaHover(false)}
          >
            {/* Primary High-Clarity 2D Stable Screenshot Canvas with Smooth Pure Opacity Crossfade */}
            <div className="w-full rounded-xl overflow-hidden bg-[#020611] border border-white/15 relative shadow-xl">
              {/* Invisible sizing anchor that guarantees natural aspect ratio and zero layout shift */}
              <img
                src={proj.heroImage}
                alt=""
                className="block w-full h-auto opacity-0 pointer-events-none select-none invisible"
                aria-hidden="true"
                style={{ transform: "none", filter: "none" }}
              />

              {/* Seamless 2D Pure Opacity Dissolve Layer (Zero transform scaling on image pixels) */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={`${proj.id}-${activeImageIndex}`}
                  src={currentImageSrc}
                  alt={proj.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute inset-0 block w-full h-full object-contain select-none"
                  style={{
                    display: "block",
                    transform: "none",
                    filter: "none",
                    backdropFilter: "none",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    imageRendering: "auto",
                  }}
                  loading="eager"
                />
              </AnimatePresence>
            </div>

            {/* Compact Thumbnail Dock (Synchronized with automatic slider & manual clicks) */}
            <div className="flex items-center justify-center gap-2 pt-0.5" role="tablist" aria-label="Project screenshots">
              {proj.detailImages.map((imgSrc, dIdx) => (
                <button
                  key={dIdx}
                  type="button"
                  role="tab"
                  aria-selected={activeImageIndex === dIdx}
                  aria-label={`Screenshot ${dIdx + 1} of ${proj.detailImages.length}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectImageIndex(dIdx);
                  }}
                  className={`w-12 sm:w-14 h-7 sm:h-8 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === dIdx
                      ? "border-cyan-400 scale-105 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt=""
                    className="block w-full h-full object-cover"
                    style={{ transform: "none", filter: "none" }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Summary Info Column (~36% width) */}
          <div className="w-full sm:w-[37%] md:w-[35%] flex flex-col justify-between text-left py-0.5 pl-1 sm:pl-2">
            <div>
              {/* Header Row: Number + Date + ACTIVE Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-cyan-400 tracking-tight leading-none">
                    {proj.numberStr}
                  </span>
                  <span className="text-[11px] font-mono text-white/50 tracking-wider">
                    {proj.date}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[9px] font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                  ACTIVE
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 leading-tight tracking-tight">
                {proj.title}
              </h3>

              {/* Verified Description */}
              <p className="text-xs text-white/70 line-clamp-3 leading-relaxed mb-3 font-light">
                {proj.description}
              </p>

              {/* Verified Technologies Row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proj.technologies.map((t) => (
                  <TechnologyChip key={t} name={t} size="sm" />
                ))}
              </div>

              {/* Verified Role Badge */}
              <div className="flex items-center gap-1.5 text-xs text-cyan-300/85 font-mono tracking-wider">
                <span>👤</span>
                <span>{proj.role}</span>
              </div>
            </div>

            {/* Bottom Action Link */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <span className="text-xs font-mono text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
                View Details <span className="text-sm">➔</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SIDE PEEK CARD ================= */
        <div className="flex w-full h-full p-2 gap-3.5 text-left">
          {/* Left Screenshot Thumbnail */}
          <div className="w-[45%] h-full rounded-xl overflow-hidden bg-slate-900/90 border border-white/10 flex items-center justify-center p-1 relative">
            <img
              src={proj.heroImage}
              alt=""
              className="w-full h-full object-cover rounded-lg opacity-85"
            />
          </div>

          {/* Right Info */}
          <div className="w-[55%] flex flex-col justify-between py-1">
            <div>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-2xl font-extrabold font-mono text-cyan-300">
                  {proj.numberStr}
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {proj.date}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white truncate mb-1">
                {proj.title}
              </h4>
              <p className="text-[11px] text-white/55 line-clamp-3 leading-snug">
                {proj.description}
              </p>
            </div>

            <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
              View Details ➔
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

// =========================================================================
// MAIN CHAPTER 5 V2 COMPONENT
// =========================================================================
export const Chapter5V2 = memo(function Chapter5V2({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMediaHovered, setIsMediaHovered] = useState(false);

  // Preload all project screenshots in background for instantaneous zero-jank decode
  useEffect(() => {
    projects.forEach((proj) => {
      proj.detailImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  // Reset screenshot index to 0 when active project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeProject]);

  // Automatic Screenshot Slider (4000ms dwell time, pause on media hover or reduced motion)
  useEffect(() => {
    if (!visible || isMediaHovered) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const totalImages = projects[activeProject]?.detailImages.length || 1;
    if (totalImages <= 1) return;

    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % totalImages);
    }, SCREENSHOT_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [visible, activeProject, isMediaHovered]);

  // Local scene progress extracted from global motionProgress (Chapter 5 = index 4)
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 4));

  // Continuous project progress mapping across the active dwell zone (4.15 -> 4.50 -> 4.85)
  const rawProjectProgress = useTransform(cp, (v) => {
    const clamped = clamp(0.15, 0.85, v);
    return ((clamped - 0.15) / 0.70) * 2;
  });

  // Dedicated spring for responsive continuous orbit motion
  const projectProgress = useSpring(rawProjectProgress, {
    stiffness: 160,
    damping: 24,
    restDelta: 0.001,
  });

  // Discrete state update for HUD billboard metadata
  useMotionValueEvent(projectProgress, "change", (latest) => {
    if (!triggered) {
      setTriggered(true);
    }

    const nearestProject = clamp(0, 2, Math.round(latest));
    if (nearestProject !== activeProject) {
      setActiveProject(nearestProject);
    }
  });


  const handlePrev = useCallback(() => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  }, []);

  // Autonomous Orbit Rotation timer
  useEffect(() => {
    if (!visible || !isAutoRotating || isHovered) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projects.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [visible, isAutoRotating, isHovered]);

  // Keyboard navigation listener
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, handlePrev, handleNext]);

  // Continuous scroll animations via MotionValue
  const opacity = useTransform(cp, (v) => {
    if (v < -0.15) return 0;
    if (v < 0.05) return easeOut((v + 0.15) / 0.20);
    if (v <= 0.88) return 1;
    if (v < 0.93) return 1 - easeOut((v - 0.88) / 0.05);
    return 0;
  });

  const translateY = useTransform(cp, (v) => {
    if (v < 0.05) return (1 - easeOut((v + 0.15) / 0.20)) * 24;
    if (v > 0.88) return -easeOut((v - 0.88) / 0.05) * 16;
    return 0;
  });

  const scale = useTransform(cp, (v) => {
    if (v < 0.05) return 0.985 + easeOut((v + 0.15) / 0.20) * 0.015;
    if (v > 0.88) return 1 - easeOut((v - 0.88) / 0.05) * 0.015;
    return 1;
  });

  const pointerEvents = useTransform(cp, (v) => (v >= 0.00 && v <= 0.88 ? "auto" : "none"));

  // Spatial Parallax & Tilt MotionValues
  const rotateX = useTransform(cp, () => mouse.y * -3.5);
  const rotateY = useTransform(cp, () => mouse.x * 4.5);

  const currentProj = projects[activeProject];

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden select-none"
      style={{
        opacity,
        scale,
        y: translateY,
        pointerEvents,
        perspective: "1400px",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* AMBIENT CELESTIAL SPACE BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${50 + mouse.x * 10}% 35%, rgba(14, 165, 233, 0.08) 0%, rgba(8, 24, 48, 0.7) 55%, #020617 100%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* STARFIELD / COSMIC DUST */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL HEADER BAR */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex items-center justify-between w-full px-8 md:px-14 pt-7">
        {/* Top Left: Chapter Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
            CHAPTER 05 / PROJECT GALLERY
          </span>
        </div>

        {/* Top Right: Chapter Step Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
            05 — GALLERY
          </span>
          <span className="text-cyan-400 text-xs">➔</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER SPATIAL VIEWPORT */}
      {/* ========================================================================= */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 -mt-2"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* PROJECT CONTEXT / SYSTEM IDENTITY HEADER (Center-Top) */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-2 z-20" style={{ transform: "translateZ(30px)" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`context-${currentProj.id}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              {/* Project Number + Date + Status Line */}
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400">
                  PROJECT {currentProj.numberStr}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-[11px] font-mono tracking-wider text-white/50">
                  {currentProj.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[9px] font-mono font-bold tracking-widest uppercase shadow-[0_0_8px_rgba(34,211,238,0.25)]">
                  {currentProj.status}
                </span>
              </div>

              {/* High-Level System Identity */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wider text-white uppercase mb-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-200">
                  {currentProj.systemIdentity}
                </span>
              </h2>

              {/* Key System Characteristics */}
              <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300/80">
                {currentProj.systemCharacteristics.map((char, idx) => (
                  <span key={char} className="flex items-center gap-2.5">
                    <span>{char}</span>
                    {idx < currentProj.systemCharacteristics.length - 1 && (
                      <span className="text-white/25">·</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* 3. PLANETARY CELESTIAL GLOBE & ORBITAL RINGS BACKDROP */}
        {/* ========================================================================= */}
        <div
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[760px] md:w-[940px] h-[760px] md:h-[940px] pointer-events-none z-0"
          style={{ transform: "translate(-50%, -50%) translateZ(-90px)", transformStyle: "preserve-3d" }}
        >
          {/* Planet Curved Oceanic Sphere */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-b from-[#0e3b66] via-[#06182c] to-[#020617] border border-cyan-400/20"
            style={{
              boxShadow:
                "0 0 140px rgba(34, 211, 238, 0.35), inset 0 0 90px rgba(34, 211, 238, 0.25), inset 0 -40px 100px rgba(0, 0, 0, 0.95)",
            }}
          >
            {/* Luminous Horizon Atmospheric Corona */}
            <div className="absolute inset-x-4 top-0 h-48 rounded-t-full bg-gradient-to-b from-cyan-400/35 via-sky-500/10 to-transparent blur-md pointer-events-none" />

            {/* Latitude / Longitude Coordinate SVG Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 800">
              <ellipse cx="400" cy="400" rx="390" ry="390" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 6" />
              <ellipse cx="400" cy="400" rx="390" ry="240" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 5" />
              <ellipse cx="400" cy="400" rx="390" ry="120" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 5" />
              <ellipse cx="400" cy="400" rx="240" ry="390" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="3 5" />
              <ellipse cx="400" cy="400" rx="120" ry="390" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="3 5" />
              <line x1="10" y1="400" x2="790" y2="400" stroke="#22d3ee" strokeWidth="1" strokeDasharray="6 6" />
              <line x1="400" y1="10" x2="400" y2="790" stroke="#22d3ee" strokeWidth="1" strokeDasharray="6 6" />
            </svg>
          </div>

          {/* Thin Elliptical Orbital Rings */}
          <div
            className="absolute -inset-16 rounded-full border border-cyan-400/25 pointer-events-none opacity-40"
            style={{
              transform: "rotateX(72deg) rotateZ(-18deg)",
              boxShadow: "0 0 40px rgba(34, 211, 238, 0.2)",
            }}
          />
          <div
            className="absolute -inset-32 rounded-full border border-purple-400/20 pointer-events-none opacity-30"
            style={{
              transform: "rotateX(74deg) rotateZ(12deg)",
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 4. 3D CONTINUOUS ORBITAL PROJECT CARDS STAGE */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-5xl h-[410px] sm:h-[450px] md:h-[470px] flex items-center justify-center z-10" style={{ transformStyle: "preserve-3d" }}>
          {/* Navigation Arrow Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="absolute -left-3 sm:left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 border border-cyan-400/30 text-white/90 hover:text-white hover:border-cyan-300 hover:bg-cyan-950/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] flex items-center justify-center transition-all backdrop-blur-md z-30 cursor-pointer text-sm"
          >
            ←
          </button>

          <button
            onClick={handleNext}
            aria-label="Next project"
            className="absolute -right-3 sm:right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 border border-cyan-400/30 text-white/90 hover:text-white hover:border-cyan-300 hover:bg-cyan-950/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] flex items-center justify-center transition-all backdrop-blur-md z-30 cursor-pointer text-sm"
          >
            →
          </button>

          {/* Render All 3 Projects on the Orbital Ring with continuous MotionValue positioning */}
          {projects.map((proj, idx) => (
            <OrbitProjectCard
              key={proj.id}
              proj={proj}
              index={idx}
              projectProgress={projectProgress}
              activeProject={activeProject}
              activeImageIndex={activeImageIndex}
              onSelectImageIndex={setActiveImageIndex}
              onSelect={setActiveProject}
              onMediaHover={setIsMediaHovered}
            />
          ))}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM HUD: AUTO ROTATION TOGGLE + PAGINATION + DRAG HINT */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex items-center justify-between w-full px-8 md:px-14 pb-6">
        {/* Bottom Left: AUTO ROTATION Toggle Switch */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md">
          <span className="text-xs text-cyan-400">📊</span>
          <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
            AUTO ROTATION
          </span>
          <button
            onClick={() => setIsAutoRotating((prev) => !prev)}
            aria-label="Toggle auto rotation"
            className={`w-8 h-4 rounded-full transition-all relative cursor-pointer p-0.5 ${
              isAutoRotating
                ? "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                : "bg-slate-800 border border-white/20"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                isAutoRotating ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Bottom Center: Glowing Track Pagination Indicator */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveProject(i)}
                aria-label={`Go to project ${i + 1}`}
                className="transition-all duration-300 cursor-pointer"
                style={{
                  width: i === activeProject ? "28px" : "8px",
                  height: "4px",
                  borderRadius: "2px",
                  background:
                    i === activeProject
                      ? "linear-gradient(90deg, #22d3ee, #818cf8)"
                      : "rgba(255,255,255,0.2)",
                  boxShadow:
                    i === activeProject ? "0 0 10px rgba(34,211,238,0.6)" : "none",
                }}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono text-white/50 tracking-[0.25em] mt-1.5 uppercase">
            0{activeProject + 1} — 0{projects.length}
          </span>
        </div>

        {/* Bottom Right: Spacer for balanced center alignment */}
        <div className="hidden sm:block w-[140px]" />
      </div>
    </motion.div>
  );
});

