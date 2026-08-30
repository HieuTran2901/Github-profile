import { useState, useContext, memo, useCallback, useEffect, useRef } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";
import { TechnologyChip } from "../TechnologyChip";

// Real Project Evidence Assets for AI Travel Marketplace
import travelMain from "../../../assets/projects/ai-travel-marketplace/AVT.PNG";
import travelPlanner from "../../../assets/projects/ai-travel-marketplace/AVT1.PNG";
import travelHotels from "../../../assets/projects/ai-travel-marketplace/AVT2.PNG";
import travelBooking from "../../../assets/projects/ai-travel-marketplace/AVT3.PNG";
import travelVideo from "../../../assets/vd.mp4";
import travelVideo1 from "../../../assets/vd1.mp4";
import travelVideo2 from "../../../assets/vd2.mp4";
import travelVideo3 from "../../../assets/vd3.mp4";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const verifiedFacts = [
  {
    icon: "🤖",
    title: "AI Concierge",
    subtitle: "Gemini · Groq · OpenAI",
    desc: "AI trip planner & intelligent assistant",
    accent: "text-purple-400",
  },
  {
    icon: "🧭",
    title: "Smart Itinerary",
    subtitle: "Real-time Optimization",
    desc: "Personalized plans & dynamic routing",
    accent: "text-cyan-400",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    subtitle: "MoMo & SePay Integration",
    desc: "QR checkout & automated verification",
    accent: "text-emerald-400",
  },
  {
    icon: "☁️",
    title: "Scalable Backend",
    subtitle: "Spring Boot 3",
    desc: "Microservices & REST API ready",
    accent: "text-sky-400",
  },
];

const techStack = [
  "Java",
  "Spring Boot",
  "React",
  "TypeScript",
  "MySQL",
  "Tailwind CSS",
  "OpenAI",
  "Vite",
  "MoMo / SePay",
];

const showcasePanels = [
  {
    id: "main",
    title: "AI Travel Marketplace Smooth Transition",
    url: "travel-marketplace.ai/demo",
    src: travelMain,
    videoSrc: travelVideo,
    badge: "SMOOTH TRANSITION",
    tabLabel: "🎬 Smooth Transition",
  },
  {
    id: "chatbox",
    title: "Intelligent Chatbox",
    url: "travel-marketplace.ai/chatbox",
    src: travelPlanner,
    videoSrc: travelVideo1,
    badge: "GEMINI / GROQ",
    tabLabel: "🤖 Intelligent Chatbox",
  },
  {
    id: "checkout",
    title: "Booking & Payment Gateway",
    url: "travel-marketplace.ai/checkout",
    src: travelBooking,
    videoSrc: travelVideo2,
    badge: "MOMO / SEPAY",
    tabLabel: "💳 MoMo / SePay Checkout",
  },
  {
    id: "listing-assistant",
    title: "Smart Listing Assistant",
    url: "travel-marketplace.ai/listings/assistant",
    src: travelHotels,
    videoSrc: travelVideo3,
    badge: "AI ASSISTANT",
    tabLabel: "🏨 Smart Listing Assistant",
  },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

export const Chapter4V2 = memo(function Chapter4V2({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(true);
  const [activePanelIdx, setActivePanelIdx] = useState(0); // default to live video

  // Local scene progress extracted from global motionProgress (Chapter 4 = index 3)
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 1.5, v - 3));

  useMotionValueEvent(cp, "change", (latest) => {
    if (latest > 0.12 && !triggered) {
      setTriggered(true);
    }
  });

  const opacity = useTransform(cp, (v) => {
    if (v < -0.15) return 0;
    if (v < 0.10) return easeOut((v + 0.15) / 0.25);
    if (v <= 0.65) return 1;
    if (v < 0.95) return 1 - easeOut((v - 0.65) / 0.30);
    return 0;
  });

  const translateY = useTransform(cp, (v) => {
    if (v < 0.10) return (1 - easeOut((v + 0.15) / 0.25)) * 24;
    if (v > 0.65) return -easeOut((v - 0.65) / 0.30) * 24;
    return 0;
  });

  const scale = useTransform(cp, (v) => {
    if (v < 0.10) return 0.985 + easeOut((v + 0.15) / 0.25) * 0.015;
    if (v > 0.65) return 1 - easeOut((v - 0.65) / 0.30) * 0.015;
    return 1;
  });

  const pointerEvents = useTransform(cp, (v) => (v >= 0.00 && v <= 0.75 ? "auto" : "none"));

  const handleNext = useCallback(() => {
    setActivePanelIdx((prev) => (prev + 1) % showcasePanels.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActivePanelIdx((prev) => (prev - 1 + showcasePanels.length) % showcasePanels.length);
  }, []);

  // Keyboard navigation listener when visible
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, handlePrev, handleNext]);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden px-5 sm:px-8 md:px-12 lg:px-14 py-4 sm:py-6 select-none"
      style={{
        opacity,
        scale,
        y: translateY,
        pointerEvents,
        perspective: "1600px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* LAYER 1: Ambient soft celestial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 75% 65% at ${55 + mouse.x * 10}% ${48 + mouse.y * 8}%, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.55) 60%, #030712 100%)`,
          transition: "background 0.3s ease",
        }}
      />

      {/* Sub-pixel Grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex items-center justify-between w-full pt-1">
        {/* Top Left: Chapter Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
            CHAPTER 04 / FEATURED PROJECT
          </span>
        </div>

        {/* Top Right: Technical step indicator */}
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
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full max-w-[1580px] mx-auto my-auto py-1">
        
        {/* LEFT COLUMN: PROJECT INFORMATION & VERIFIED FACTS (5 cols on lg) */}
        <motion.div
          className="lg:col-span-5 flex flex-col items-start text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={triggered ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          {/* Subtitle Pill */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              FEATURED PROJECT
            </span>
            <span className="text-[11px] font-mono tracking-wider text-white/60">
              Full Stack · AI
            </span>
          </div>

          {/* Large Project Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 leading-[1.05]">
            AI Travel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500">
              Marketplace
            </span>
          </h2>

          {/* Concise Factual Description */}
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg mb-3.5 font-light tracking-wide">
            An AI-powered travel marketplace combining multi-LLM intelligent recommendations (Gemini & Groq), real-time itinerary planning, MoMo/SePay payment gateways, and scalable Spring Boot backend services.
          </p>

          {/* Verified Technology Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {techStack.map((tech) => (
              <TechnologyChip key={tech} name={tech} size="md" />
            ))}
          </div>

          {/* 4 Compact Verified Project Fact Cards */}
          <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
            {verifiedFacts.map((fact, idx) => (
              <div
                key={idx}
                className="p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md shadow-sm flex flex-col justify-between hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{fact.icon}</span>
                  <span className={`text-[10px] sm:text-[11px] font-bold font-mono tracking-wide ${fact.accent}`}>
                    {fact.title}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-white/80 font-medium tracking-tight">
                  {fact.subtitle}
                </span>
                <span className="text-[8px] sm:text-[9px] text-white/45 tracking-wider mt-0.5">
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

        {/* RIGHT COLUMN: HIGH-PERFORMANCE BUTTER-SMOOTH HERO SHOWCASE (7 cols on lg) */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-center justify-center relative mt-2 lg:mt-0 w-full select-none"
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={triggered ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Browser Mockup Frame (Direct GPU Hardware Surface with zero 3D matrix strain) */}
          <div className="w-full rounded-2xl overflow-hidden bg-[#070f1e] border border-cyan-400/50 shadow-[0_20px_70px_rgba(0,180,255,0.25),0_30px_90px_rgba(0,0,0,0.85)] relative">
            {/* Browser Top Bar */}
            <div className="h-9 px-4 bg-slate-950/95 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-white/50 ml-2">
                  {showcasePanels[activePanelIdx]?.url || "travel-marketplace.ai/demo"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] uppercase tracking-wider">
                  {showcasePanels[activePanelIdx]?.badge || "SMOOTH TRANSITION"}
                </span>
              </div>
            </div>

            {/* Media Presentation Container (60fps Silky Smooth Video / Crisp Screenshot) */}
            <div className="w-full bg-[#030712] p-1.5 sm:p-2 flex items-center justify-center relative overflow-hidden">
              {showcasePanels[activePanelIdx]?.videoSrc ? (
                <video
                  key={showcasePanels[activePanelIdx].id}
                  src={showcasePanels[activePanelIdx].videoSrc}
                  poster={showcasePanels[activePanelIdx].src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                  ref={(el) => {
                    if (el && el.paused) {
                      el.play().catch(() => {});
                    }
                  }}
                  className="w-full h-auto max-h-[50vh] object-cover rounded-lg shadow-sm"
                  style={{
                    display: "block",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                />
              ) : (
                <img
                  key={showcasePanels[activePanelIdx]?.id}
                  src={showcasePanels[activePanelIdx]?.src}
                  alt={showcasePanels[activePanelIdx]?.title}
                  draggable={false}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg shadow-sm select-none"
                  style={{
                    display: "block",
                    transform: "none",
                    filter: "none",
                  }}
                />
              )}
            </div>
          </div>

          {/* Interactive Feature View Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {showcasePanels.map((panel, idx) => (
              <button
                key={panel.id}
                onClick={() => setActivePanelIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePanelIdx === idx
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.35)] scale-[1.02]"
                    : "bg-slate-950/70 text-white/50 border border-white/10 hover:text-white/85 hover:border-white/25"
                }`}
              >
                <span>{panel.tabLabel}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
});

