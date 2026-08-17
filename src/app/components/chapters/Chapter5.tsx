import { useState, useContext, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValueEvent, useSpring } from "motion/react";
import type { MotionValue } from "motion/react";
import { MotionCtx } from "../../App";
import studyplan from "../../../assets/studyplan.png";
import studyplan1 from "../../../assets/studyplan1.png";
import studyplan2 from "../../../assets/studyplan2.png";
import travel from "../../../assets/travel.JPG";
import travel1 from "../../../assets/travel1.JPG";
import travel2 from "../../../assets/travel2.JPG";
import dcc from "../../../assets/dcc.JPG";
import dcc1 from "../../../assets/dcc1.JPG";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

interface TechBadge {
  name: string;
  icon: string;
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
  description: string;
  role: string;
  technologies: TechBadge[];
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
    description:
      "AI-powered study planning platform for organizing learning goals, schedules, progress, and personalized study workflows.",
    role: "Full-Stack Developer",
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "TypeScript", icon: "TS" },
      { name: "Vite", icon: "⚡" },
      { name: "Tailwind v4", icon: "🎨" },
      { name: "Framer Motion", icon: "✨" },
      { name: "Spring Boot", icon: "🌱" },
      { name: "Java", icon: "☕" },
    ],
    heroImage: studyplan,
    detailImages: [studyplan, studyplan1, studyplan2],
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
    description:
      "AI-powered travel marketplace combining personalized recommendations, real-time travel workflows, and scalable backend services.",
    role: "Lead Developer",
    technologies: [
      { name: "Java", icon: "☕" },
      { name: "Spring Boot", icon: "🌱" },
      { name: "React", icon: "⚛️" },
      { name: "TypeScript", icon: "TS" },
      { name: "OpenAI", icon: "🤖" },
      { name: "AWS", icon: "☁️" },
      { name: "Docker", icon: "🐳" },
    ],
    heroImage: travel,
    detailImages: [travel, travel1, travel2],
    accent: "#00d2ff",
    accentGlow: "rgba(0, 210, 255, 0.4)",
  },
  {
    id: "dcc",
    index: 2,
    numberStr: "03",
    date: "07.08.2026",
    year: "2026",
    title: "Developer Control Center",
    titleAccent: "Center",
    subtitle: "Desktop Developer Tooling & Diagnostics",
    category: "Desktop Tooling · Systems",
    status: "PRODUCTION",
    description:
      "Desktop developer control center for managing processes, terminals, workspaces, diagnostics, and development workflows.",
    role: "Full-Stack Systems Engineer",
    technologies: [
      { name: "Tauri", icon: "🐂" },
      { name: "Rust", icon: "🦀" },
      { name: "React", icon: "⚛️" },
      { name: "TypeScript", icon: "TS" },
      { name: "Tailwind CSS", icon: "🎨" },
      { name: "IPC", icon: "⚡" },
    ],
    heroImage: dcc,
    detailImages: [dcc, dcc1],
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.4)",
  },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

// =========================================================================
// ORBITAL PROJECT CARD (Clean credible layout with verified stack & role)
// =========================================================================
const OrbitProjectCard = memo(function OrbitProjectCard({
  proj,
  index,
  projectProgress,
  activeProject,
  activeDetailImage,
  onSelectDetailImage,
  onSelect,
}: {
  proj: StoryProject;
  index: number;
  projectProgress: MotionValue<number>;
  activeProject: number;
  activeDetailImage: string;
  onSelectDetailImage: (src: string) => void;
  onSelect: (idx: number) => void;
}) {
  const x = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return Math.sin(rel * (Math.PI / 2.5)) * 490;
  });

  const z = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return 130 - Math.abs(rel) * 150;
  });

  const scale = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    const absRel = Math.min(1.5, Math.abs(rel));
    return 1.0 - absRel * 0.24;
  });

  const rotateY = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return -rel * 20;
  });

  const opacity = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    const absRel = Math.min(1.5, Math.abs(rel));
    return 1.0 - absRel * 0.32;
  });

  const isActive = index === activeProject;

  return (
    <motion.div
      onClick={() => onSelect(index)}
      style={{
        x,
        z,
        scale,
        rotateY,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className={`absolute rounded-2xl overflow-hidden backdrop-blur-2xl transition-all cursor-pointer select-none ${
        isActive
          ? "w-[94%] sm:w-[740px] md:w-[780px] h-[330px] sm:h-[360px] bg-[#070f1e]/90 border border-cyan-400/50 shadow-[0_20px_70px_rgba(0,180,255,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] z-20"
          : "w-[78%] sm:w-[500px] h-[270px] sm:h-[300px] bg-[#050c18]/80 border border-white/15 hover:border-cyan-400/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-10"
      }`}
    >
      {isActive ? (
        /* ================= ACTIVE CENTER CARD ================= */
        <div className="flex flex-col sm:flex-row w-full h-full">
          {/* Left Screenshot Stage (~55%) */}
          <div className="w-full sm:w-[56%] h-48 sm:h-full bg-slate-950/80 relative flex flex-col justify-between p-3.5 border-b sm:border-b-0 sm:border-r border-white/10">
            {/* Main Screenshot Canvas */}
            <div className="w-full flex-1 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1 relative group">
              <img
                src={activeDetailImage || proj.heroImage}
                alt={proj.title}
                className="w-full h-full object-contain rounded-lg transition-all duration-300"
              />
            </div>

            {/* Sub-Thumbnails Dock */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {proj.detailImages.map((imgSrc, dIdx) => (
                <button
                  key={dIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDetailImage(imgSrc);
                  }}
                  className={`w-11 h-7 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    activeDetailImage === imgSrc
                      ? "border-cyan-400 scale-105 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Summary Info Stage (~44%) */}
          <div className="w-full sm:w-[44%] p-5 sm:p-6 flex flex-col justify-between text-left">
            <div>
              {/* Header Row: Number + Date + ACTIVE Badge */}
              <div className="flex items-center justify-between mb-2.5">
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

              {/* Title & Short Verified Description */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight tracking-tight">
                {proj.title}
              </h3>
              <p className="text-xs text-white/70 line-clamp-3 leading-relaxed mb-3.5 font-light">
                {proj.description}
              </p>

              {/* Verified Technologies Row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proj.technologies.slice(0, 5).map((t) => (
                  <span
                    key={t.name}
                    className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-white/10 text-white/80 text-[10px] font-mono tracking-wide backdrop-blur-md shadow-sm flex items-center gap-1"
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                ))}
              </div>

              {/* Verified Role Badge */}
              <div className="flex items-center gap-1.5 text-xs text-cyan-300/85 font-mono tracking-wider">
                <span>👤</span>
                <span>{proj.role}</span>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <span className="text-xs font-mono text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
                View Details <span className="text-sm">➔</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SIDE PEEK CARD ================= */
        <div className="flex w-full h-full p-4 gap-3.5 text-left">
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
// MAIN CHAPTER 5 COMPONENT
// =========================================================================
export const Chapter5 = memo(function Chapter5({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [activeProject, setActiveProject] = useState(1);
  const [activeDetailImage, setActiveDetailImage] = useState<string>("");
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Update active detail image on project change
  useEffect(() => {
    setActiveDetailImage(projects[activeProject].heroImage);
  }, [activeProject]);

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
    const entering = v < 0.12;
    const exiting = v > 0.86;
    return entering ? easeOut(v / 0.12) : exiting ? 1 - easeOut((v - 0.86) / 0.14) : 1;
  });

  const translateY = useTransform(cp, (v) => {
    const entering = v < 0.12;
    return entering ? (1 - easeOut(v / 0.12)) * 30 : 0;
  });

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
        y: translateY,
        perspective: "1400px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
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
        {/* BILLBOARD PROJECT HEADER (Center-Top) */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-2 z-20" style={{ transform: "translateZ(30px)" }}>
          {/* Status & Category Badge */}
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              {currentProj.status}
            </span>
            <span className="text-[11px] font-mono tracking-wider text-white/60">
              {currentProj.category}
            </span>
          </div>

          {/* Large Project Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentProj.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2"
            >
              <span>{currentProj.title.replace(currentProj.titleAccent, "")}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300">
                {currentProj.titleAccent}
              </span>
            </motion.h2>
          </AnimatePresence>

          {/* Concise Verified Project Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentProj.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.04 }}
              className="text-xs sm:text-sm text-white/70 max-w-xl line-clamp-2 leading-relaxed mb-3 font-light"
            >
              {currentProj.description}
            </motion.p>
          </AnimatePresence>

          {/* Technology Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2.5">
            {currentProj.technologies.map((t) => (
              <span
                key={t.name}
                className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-white/80 text-[10px] font-mono tracking-wide backdrop-blur-md shadow-sm flex items-center gap-1.5"
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </span>
            ))}
          </div>

          {/* Role + View Project Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-cyan-300/85 font-mono tracking-wider">
              <span>👤</span>
              <span>{currentProj.role}</span>
            </div>

            <button
              className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/30 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold tracking-widest uppercase hover:bg-cyan-500/25 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>VIEW PROJECT</span>
              <span className="text-sm">➔</span>
            </button>
          </div>
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
        <div className="relative w-full max-w-5xl h-[330px] sm:h-[360px] flex items-center justify-center z-10" style={{ transformStyle: "preserve-3d" }}>
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
              activeDetailImage={activeDetailImage}
              onSelectDetailImage={setActiveDetailImage}
              onSelect={setActiveProject}
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

        {/* Bottom Right: Drag / Scroll Navigation Hint */}
        <div className="hidden sm:flex items-center gap-2 text-white/40 text-[9px] font-mono tracking-wider uppercase">
          <span className="text-xs">🖱️</span>
          <div className="flex flex-col text-right leading-tight">
            <span>DRAG TO EXPLORE</span>
            <span>SCROLL TO NAVIGATE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
