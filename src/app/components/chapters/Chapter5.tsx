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

interface StoryProject {
  id: string;
  index: number;
  numberStr: string;
  date: string;
  year: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
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
    subtitle: "AI-Powered Study & Workflow Planning",
    category: "Frontend · Full Stack · AI",
    status: "PRODUCTION",
    description:
      "AI-powered study planning platform for organizing learning goals, schedules, progress, and personalized study workflows.",
    role: "Full-Stack Developer",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS v4", "Framer Motion", "Spring Boot", "Java"],
    heroImage: studyplan,
    detailImages: [studyplan1, studyplan2],
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
    subtitle: "Intelligent Travel & Booking Platform",
    category: "Full Stack · AI",
    status: "PRODUCTION",
    description:
      "Intelligent travel platform with LLM-powered recommendations, real-time pricing, and distributed microservices architecture serving 500+ users.",
    role: "Lead Developer",
    technologies: ["Java", "Spring Boot", "React", "TypeScript", "OpenAI", "AWS", "Docker"],
    heroImage: travel,
    detailImages: [travel1, travel2],
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
    subtitle: "Desktop Developer Tooling & Diagnostics",
    category: "Desktop Tooling · Systems",
    status: "PRODUCTION",
    description:
      "Desktop developer control center for managing processes, terminals, workspaces, diagnostics, and development workflows.",
    role: "Full-Stack Systems Engineer",
    technologies: ["Tauri", "Rust", "React", "TypeScript", "Tailwind CSS", "IPC"],
    heroImage: dcc,
    detailImages: [dcc1],
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

// Sub-component for individual project cards with continuous MotionValue transforms
const OrbitProjectCard = memo(function OrbitProjectCard({
  proj,
  index,
  projectProgress,
  activeProject,
  onSelect,
}: {
  proj: StoryProject;
  index: number;
  projectProgress: MotionValue<number>;
  activeProject: number;
  onSelect: (idx: number) => void;
}) {
  const x = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return Math.sin(rel * (Math.PI / 2.6)) * 460;
  });

  const z = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return 120 - Math.abs(rel) * 140;
  });

  const scale = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    const absRel = Math.min(1.5, Math.abs(rel));
    return 1.0 - absRel * 0.28;
  });

  const rotateY = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    return -rel * 22;
  });

  const opacity = useTransform(projectProgress, (p) => {
    let rel = index - p;
    while (rel < -1.5) rel += 3;
    while (rel > 1.5) rel -= 3;
    const absRel = Math.min(1.5, Math.abs(rel));
    return 1.0 - absRel * 0.38;
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
      className={`absolute rounded-2xl overflow-hidden backdrop-blur-xl border cursor-pointer ${
        isActive
          ? "w-[92%] sm:w-[680px] md:w-[740px] h-[310px] sm:h-[340px] bg-slate-950/85 border-sky-400/50 shadow-[0_20px_60px_rgba(0,180,255,0.22)] z-20"
          : "w-[75%] sm:w-[480px] h-[260px] sm:h-[290px] bg-slate-950/70 border-white/10 hover:border-white/30 z-10"
      }`}
    >
      {isActive ? (
        /* ================= ACTIVE CENTER CARD ================= */
        <div className="flex flex-col sm:flex-row w-full h-full">
          {/* Left/Main Hero Screenshot Stage */}
          <div className="w-full sm:w-[58%] h-48 sm:h-full bg-slate-950/90 relative overflow-hidden flex items-center justify-center p-2 border-b sm:border-b-0 sm:border-r border-white/10">
            <img
              src={proj.heroImage}
              alt={proj.title}
              className="w-full h-full object-contain rounded-lg select-none"
            />
          </div>

          {/* Right Summary Info Stage */}
          <div className="w-full sm:w-[42%] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Milestone Number + Active Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono text-sky-400 leading-none">
                    {proj.numberStr}
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    {proj.year}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[9px] font-mono font-bold tracking-wider">
                  ACTIVE
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
                {proj.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-3 leading-relaxed mb-4">
                {proj.description}
              </p>
            </div>

            {/* Detail Thumbnails Switcher & Link */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex gap-1.5">
                {proj.detailImages.map((imgSrc, dIdx) => (
                  <div
                    key={dIdx}
                    className="w-9 h-6 rounded overflow-hidden border border-white/15 bg-black/40"
                  >
                    <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <span className="text-xs font-mono text-sky-400 font-semibold hover:underline flex items-center gap-1">
                View Details ➔
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SIDE PEEK CARD ================= */
        <div className="flex flex-col w-full h-full p-4 justify-between">
          <div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-extrabold font-mono text-white/80">
                {proj.numberStr}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {proj.year}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white/90 truncate mb-1">
              {proj.title}
            </h4>
            <p className="text-[11px] text-white/50 line-clamp-2">
              {proj.description}
            </p>
          </div>

          <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-900/80 border border-white/10 mt-2 flex items-center justify-center">
            <img
              src={proj.heroImage}
              alt=""
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
});

export const Chapter5 = memo(function Chapter5({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

  // Local scene progress extracted from global motionProgress (Chapter 5 = index 4)
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 4));

  // Continuous project progress mapping across the active dwell zone (4.15 -> 4.50 -> 4.85)
  // Maps cp from [0.15, 0.50, 0.85] continuously to [0, 1, 2]
  const rawProjectProgress = useTransform(cp, (v) => {
    const clamped = clamp(0.15, 0.85, v);
    return ((clamped - 0.15) / 0.70) * 2;
  });

  // Dedicated spring for ultra-smooth fluid orbit movement
  const projectProgress = useSpring(rawProjectProgress, {
    stiffness: 160,
    damping: 24,
    restDelta: 0.001,
  });

  // Discrete state update for HUD billboard metadata (Fires only when crossing midpoints)
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
    >
      {/* AMBIENT CELESTIAL BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${50 + mouse.x * 10}% 35%, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.6) 60%, #030712 100%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* STARFIELD / CELESTIAL DUST GRID */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* TOP GLOBAL HEADER HUD */}
      <div className="relative z-30 flex items-center justify-between w-full px-8 md:px-16 pt-8">
        {/* Top Left: Chapter Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/70 uppercase">
            CHAPTER 05 / PROJECT GALLERY
          </span>
        </div>

        {/* Top Right: Chapter Step Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/40">
            05 — GALLERY
          </span>
          <div className="flex items-center gap-1 text-sky-400 text-xs">
            ➔
          </div>
        </div>
      </div>

      {/* CENTER SPATIAL VIEWPORT */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ========================================================================= */}
        {/* 1. TOP ACTIVE PROJECT METADATA HUD (Center-Top Billboard) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-2 z-20" style={{ transform: "translateZ(30px)" }}>
          {/* Status & Category Pill */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              {currentProj.status}
            </span>
            <span className="text-[11px] font-mono tracking-wider text-white/60">
              {currentProj.category}
            </span>
          </div>

          {/* Big Project Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentProj.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
              style={{
                textShadow: "0 2px 20px rgba(56,189,248,0.25)",
              }}
            >
              {currentProj.title}
            </motion.h2>
          </AnimatePresence>

          {/* Short Project Description */}
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
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
            {currentProj.technologies.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-white/10 text-white/75 text-[10px] font-mono tracking-wide backdrop-blur-md shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Role Badge + View Project CTA Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-sky-300/80 font-mono tracking-wider">
              <span>👤</span>
              <span>{currentProj.role}</span>
            </div>

            <button
              className="px-5 py-1.5 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold tracking-widest uppercase hover:bg-sky-500/30 hover:border-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all cursor-pointer"
            >
              VIEW PROJECT
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PLANETARY CELESTIAL HORIZON & SPATIAL ORBIT BACKDROP */}
        {/* ========================================================================= */}
        <div
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[760px] md:w-[940px] h-[760px] md:h-[940px] pointer-events-none z-0"
          style={{ transform: "translate(-50%, -50%) translateZ(-90px)", transformStyle: "preserve-3d" }}
        >
          {/* Planet Horizon Curved Sphere */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-b from-[#0e3b66] via-[#08182b] to-[#020617] border border-sky-400/20"
            style={{
              boxShadow:
                "0 0 120px rgba(56, 189, 248, 0.35), inset 0 0 80px rgba(56, 189, 248, 0.25), inset 0 -40px 100px rgba(0, 0, 0, 0.9)",
            }}
          >
            {/* Atmosphere Horizon Glow Arc */}
            <div className="absolute inset-x-4 top-0 h-44 rounded-t-full bg-gradient-to-b from-sky-400/30 via-cyan-500/10 to-transparent blur-md pointer-events-none" />

            {/* Latitude / Longitude SVG Grid Mesh */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 800">
              <ellipse cx="400" cy="400" rx="390" ry="390" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" />
              <ellipse cx="400" cy="400" rx="390" ry="240" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 5" />
              <ellipse cx="400" cy="400" rx="390" ry="120" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 5" />
              <ellipse cx="400" cy="400" rx="240" ry="390" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 5" />
              <ellipse cx="400" cy="400" rx="120" ry="390" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 5" />
              <line x1="10" y1="400" x2="790" y2="400" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 6" />
              <line x1="400" y1="10" x2="400" y2="790" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 6" />
            </svg>
          </div>

          {/* Orbital Light Ellipses */}
          <div
            className="absolute -inset-16 rounded-full border border-sky-400/25 pointer-events-none opacity-40"
            style={{
              transform: "rotateX(72deg) rotateZ(-18deg)",
              boxShadow: "0 0 40px rgba(56, 189, 248, 0.2)",
            }}
          />
          <div
            className="absolute -inset-32 rounded-full border border-cyan-400/15 pointer-events-none opacity-30"
            style={{
              transform: "rotateX(74deg) rotateZ(12deg)",
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 3. 3D CONTINUOUS ORBITAL PROJECT CARDS STAGE */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-5xl h-[330px] sm:h-[360px] flex items-center justify-center z-10" style={{ transformStyle: "preserve-3d" }}>
          {/* Navigation Arrow Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="absolute -left-3 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 border border-white/20 text-white/80 hover:text-white hover:border-sky-400 hover:bg-slate-900 flex items-center justify-center transition-all backdrop-blur-md z-30 cursor-pointer shadow-xl"
          >
            &#8249;
          </button>

          <button
            onClick={handleNext}
            aria-label="Next project"
            className="absolute -right-3 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 border border-white/20 text-white/80 hover:text-white hover:border-sky-400 hover:bg-slate-900 flex items-center justify-center transition-all backdrop-blur-md z-30 cursor-pointer shadow-xl"
          >
            &#8250;
          </button>

          {/* Render All 3 Projects on the Orbital Ring with continuous MotionValue positioning */}
          {projects.map((proj, idx) => (
            <OrbitProjectCard
              key={proj.id}
              proj={proj}
              index={idx}
              projectProgress={projectProgress}
              activeProject={activeProject}
              onSelect={setActiveProject}
            />
          ))}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ORBIT SLIDER INDICATOR */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center pb-6">
        <div className="flex items-center gap-3">
          {/* Progress dots */}
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
                      ? "linear-gradient(90deg, #38bdf8, #00d2ff)"
                      : "rgba(255,255,255,0.2)",
                  boxShadow:
                    i === activeProject ? "0 0 10px rgba(56,189,248,0.6)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Milestone numeric range */}
        <span className="text-[10px] font-mono text-white/40 tracking-[0.25em] mt-2 uppercase">
          0{activeProject + 1} — 0{projects.length}
        </span>
      </div>
    </motion.div>
  );
});
