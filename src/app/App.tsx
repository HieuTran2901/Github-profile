/* MARKER-MAKE-KIT-INVOKED */
/* MARKER-MAKE-KIT-DISCOVERY-READ */
import { useEffect, useState, createContext, useMemo } from "react";
import { useScroll, useMotionValueEvent, useTransform, useSpring, motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { Particles } from "./components/Particles";
import { CustomCursor } from "./components/CustomCursor";
import { ChapterNav } from "./components/ChapterNav";
import { Chapter1 } from "./components/chapters/Chapter1";
import { Chapter2 } from "./components/chapters/Chapter2";
import { Chapter3 } from "./components/chapters/Chapter3";
import { Chapter4 } from "./components/chapters/Chapter4";
import { Chapter5 } from "./components/chapters/Chapter5";
import { Chapter6 } from "./components/chapters/Chapter6";

export type MousePos = { x: number; y: number };
export const ScrollCtx = createContext<{ progress: number; mouse: MousePos }>({
  progress: 0,
  mouse: { x: 0, y: 0 },
});

export const MotionCtx = createContext<{ motionProgress: MotionValue<number> | null; mouse: MousePos }>({
  motionProgress: null,
  mouse: { x: 0, y: 0 },
});

const TOTAL_CHAPTERS = 6;
// Story height calibrated for responsive storytelling pacing
const SCROLL_SPACE_HEIGHT = `${TOTAL_CHAPTERS * 75}vh`;

const CHAPTER_LABELS = ["INTRO", "JOURNEY", "SKILLS", "PROJECT", "GALLERY", "CONTACT"];
const ChapterComponents = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

interface StoryStop {
  id: string;
  chapter: number;
  progress: number;
  label: string;
  type: "SCENE_BASED" | "BEAT_BASED";
}

const STORY_STOPS: StoryStop[] = [
  // Chapter 1: Intro (SCENE-BASED - Initial Hero Scene)
  { id: "ch1", chapter: 0, progress: 0.00, label: "Intro Hero", type: "SCENE_BASED" },

  // Chapter 2: Journey (BEAT-BASED - 5 Milestones)
  { id: "ch2-2022", chapter: 1, progress: 1.15, label: "2022 University / UI", type: "BEAT_BASED" },
  { id: "ch2-2023", chapter: 1, progress: 1.30, label: "2023 E-Commerce PHP", type: "BEAT_BASED" },
  { id: "ch2-2024", chapter: 1, progress: 1.45, label: "2024 AI / Computer Vision", type: "BEAT_BASED" },
  { id: "ch2-2025", chapter: 1, progress: 1.60, label: "2025 AI Integration", type: "BEAT_BASED" },
  { id: "ch2-2026", chapter: 1, progress: 1.75, label: "2026 Agentic Workflow", type: "BEAT_BASED" },

  // Chapter 3: Skills (SCENE-BASED - Active Dwell Center)
  { id: "ch3", chapter: 2, progress: 2.35, label: "Core Skills Showcase", type: "SCENE_BASED" },

  // Chapter 4: Featured Project (SCENE-BASED - Active Dwell Center)
  { id: "ch4", chapter: 3, progress: 3.35, label: "Featured Project Showcase", type: "SCENE_BASED" },

  // Chapter 5: Project Gallery (BEAT-BASED - 3 Projects)
  { id: "ch5-p1", chapter: 4, progress: 4.15, label: "Gallery / AI Study Planner", type: "BEAT_BASED" },
  { id: "ch5-p2", chapter: 4, progress: 4.50, label: "Gallery / AI Travel Marketplace", type: "BEAT_BASED" },
  { id: "ch5-p3", chapter: 4, progress: 4.85, label: "Gallery / Developer Control Center", type: "BEAT_BASED" },

  // Chapter 6: Contact (SCENE-BASED - Closing Scene)
  { id: "ch6", chapter: 5, progress: 5.00, label: "Contact & Connect", type: "SCENE_BASED" },
];

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [mouse, setMouse] = useState<MousePos>({ x: 0, y: 0 });
  
  // NATIVE SCROLL ENGINE + FRAMER MOTION (PURE MOTIONVALUE ARCHITECTURE)
  const { scrollYProgress } = useScroll();
  const rawMotionProgress = useTransform(scrollYProgress, [0, 1], [0, TOTAL_CHAPTERS - 1]);
  
  // PHASE 15A: Liquid physics MotionValue smoothing tuned for deliberate Story Beat Stops
  const motionProgress = useSpring(rawMotionProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  // Derived MotionValues for GPU-accelerated global UI elements (0 FPS React re-renders)
  const topProgressBarWidth = useTransform(motionProgress, [0, TOTAL_CHAPTERS - 1], ["0%", "100%"]);

  // Context value memoization
  const motionCtxValue = useMemo(() => ({ motionProgress, mouse }), [motionProgress, mouse]);
  const scrollCtxValue = useMemo(() => ({ progress: activeChapter, mouse }), [activeChapter, mouse]);

  // Discrete state update for ChapterNav and chapter visibility (Fires ONLY when active chapter changes)
  useMotionValueEvent(motionProgress, "change", (latest) => {
    let currentCh = 0;
    if (latest < 0.85) currentCh = 0; // Chapter 1: Intro (0.00)
    else if (latest < 1.85) currentCh = 1; // Chapter 2: Journey (1.10 - 1.75)
    else if (latest < 2.85) currentCh = 2; // Chapter 3: Skills (2.35)
    else if (latest < 3.85) currentCh = 3; // Chapter 4: Featured Project (3.35)
    else if (latest < 4.90) currentCh = 4; // Chapter 5: Project Gallery (4.15 - 4.85)
    else currentCh = 5;                    // Chapter 6: Contact (5.00)

    if (currentCh !== activeChapter) {
      setActiveChapter(currentCh);
    }
  });

  // Helper to scroll smoothly to a specific Story Stop
  const scrollToStop = (stopIdx: number) => {
    const safeIdx = Math.max(0, Math.min(STORY_STOPS.length - 1, stopIdx));
    const targetProgress = STORY_STOPS[safeIdx].progress;
    const totalScrollable = document.body.scrollHeight - window.innerHeight;
    const targetScrollY = (targetProgress / (TOTAL_CHAPTERS - 1)) * totalScrollable;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  // Helper to find nearest Story Stop index based on current scroll position
  const getNearestStopIndex = () => {
    const totalScrollable = document.body.scrollHeight - window.innerHeight;
    if (totalScrollable <= 0) return 0;
    const currentProgress = (window.scrollY / totalScrollable) * (TOTAL_CHAPTERS - 1);
    
    let closestIdx = 0;
    let minDiff = Infinity;
    STORY_STOPS.forEach((stop, idx) => {
      const diff = Math.abs(stop.progress - currentProgress);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  };

  // PHASE 15C — STORY BEAT WHEEL & TRACKPAD INTENT CONTROLLER WITH INITIAL INTRO GUARD
  useEffect(() => {
    let isLocked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion || window.innerWidth < 768) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 15) return; // Ignore tiny touch/wheel vibrations

      if (isLocked) {
        e.preventDefault();
        return;
      }

      const currentStopIdx = getNearestStopIndex();

      let targetStopIdx = currentStopIdx;

      if (delta > 0 && currentStopIdx < STORY_STOPS.length - 1) {
        targetStopIdx = currentStopIdx + 1;
      } else if (delta < 0 && currentStopIdx > 0) {
        targetStopIdx = currentStopIdx - 1;
      }

      if (targetStopIdx !== currentStopIdx) {
        e.preventDefault();
        isLocked = true;
        
        scrollToStop(targetStopIdx);

        if (lockTimer) clearTimeout(lockTimer);
        lockTimer = setTimeout(() => {
          isLocked = false;
        }, 520);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, []);

  // PHASE 15A — KEYBOARD NAVIGATION CONTROLLER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        const currentIdx = getNearestStopIndex();
        if (currentIdx < STORY_STOPS.length - 1) {
          e.preventDefault();
          scrollToStop(currentIdx + 1);
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        const currentIdx = getNearestStopIndex();
        if (currentIdx > 0) {
          e.preventDefault();
          scrollToStop(currentIdx - 1);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToStop(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToStop(STORY_STOPS.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleMouse = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setMouse({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
        rafId = null;
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavigate = (i: number) => {
    // Find first Story Stop corresponding to target chapter
    const firstStopIdx = STORY_STOPS.findIndex((s) => s.chapter === i);
    if (firstStopIdx !== -1) {
      scrollToStop(firstStopIdx);
    } else {
      const targetScrollY = (i / (TOTAL_CHAPTERS - 1)) * (document.body.scrollHeight - window.innerHeight);
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  return (
    <ScrollCtx.Provider value={scrollCtxValue}>
      <MotionCtx.Provider value={motionCtxValue}>
      <style>{`
        * { cursor: none !important; }
        body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        /* Override index.html height to allow native scrolling with CSS Scroll Snap */
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        html, body, #root { height: auto !important; min-height: 100%; }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.2), 0 0 40px rgba(56,189,248,0.1); }
          50% { box-shadow: 0 0 30px rgba(56,189,248,0.4), 0 0 60px rgba(56,189,248,0.2); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-snap-type: none !important; }
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Global Scroll Space with Native CSS Story Beat Snap Anchors */}
      <div style={{ height: SCROLL_SPACE_HEIGHT, width: "100%", position: "relative" }}>
        {STORY_STOPS.map((stop) => (
          <div
            key={stop.id}
            style={{
              position: "absolute",
              top: `${(stop.progress / (TOTAL_CHAPTERS - 1)) * 100}%`,
              height: "100vh",
              width: "100%",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* Fixed Viewport for Storytelling Layer */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ background: "#04040c", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(4,4,12,0.6) 100%)",
          }}
        />

        {/* Particles */}
        <Particles />

        {/* Chapters */}
        {ChapterComponents.map((ChapterComp, i) => {
          const visible = Math.abs(activeChapter - i) <= 1;
          return (
            <ChapterComp
              key={i}
              chapterProgress={0}
              visible={visible}
              globalProgress={0}
            />
          );
        })}

        {/* Chapter navigation */}
        <ChapterNav
          labels={CHAPTER_LABELS}
          active={activeChapter}
          onNavigate={handleNavigate}
        />

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Modern Global Scroll Progress Bar (Top) */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-950/40 backdrop-blur-sm pointer-events-none z-50 overflow-hidden border-b border-white/[0.04]">
          <motion.div
            className="h-full relative pointer-events-none"
            style={{
              width: topProgressBarWidth,
              background: "linear-gradient(90deg, #06b6d4 0%, #38bdf8 35%, #818cf8 70%, #c084fc 100%)",
              boxShadow: "0 0 14px rgba(56,189,248,0.9), 0 0 28px rgba(168,85,247,0.6)",
            }}
          >
            {/* Glowing particle at the trailing edge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8,0_0_20px_#a855f7] opacity-80" />
          </motion.div>
        </div>


      </div>
      </MotionCtx.Provider>
    </ScrollCtx.Provider>
  );
}

