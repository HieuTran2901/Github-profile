import { useState, useContext, memo, useCallback } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { MotionCtx } from "../../App";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

const valueHighlights = [
  {
    icon: (
      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Fast Response",
    desc: "I usually reply within 24 hours",
    accent: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Open to Opportunities",
    desc: "Full-time, Freelance, Projects",
    accent: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Tech & AI Enthusiast",
    desc: "Passionate about building impact",
    accent: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Remote Friendly",
    desc: "Available worldwide",
    accent: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:trunghieu10a1thptll@gmail.com",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Website",
    href: "#",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

function clamp(min: number, max: number, val: number) {
  return Math.max(min, Math.min(max, val));
}

export const Chapter6 = memo(function Chapter6({ visible }: Props) {
  const { mouse, motionProgress } = useContext(MotionCtx);
  const [triggered, setTriggered] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedLocation, setCopiedLocation] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Local scene progress extracted from global motionProgress (Chapter 6 = index 5)
  // When at Chapter 6, motionProgress = 5.00, so cp = 0.00
  const cp = useTransform(motionProgress!, (v: number) => clamp(-0.5, 0.5, v - 5));

  useMotionValueEvent(cp, "change", (latest) => {
    if (latest > -0.2 && !triggered) {
      setTriggered(true);
    }
  });

  // Entering animation as user approaches Chapter 6 (cp goes from -0.35 to 0.00)
  // When at Chapter 6 (cp >= 0), opacity is 1.0 and translateY is 0px
  const opacity = useTransform(cp, [-0.35, 0], [0, 1]);
  const translateY = useTransform(cp, [-0.35, 0], [30, 0]);

  // Parallax Tilt MotionValues
  const rotateX = useTransform(cp, (v) => v * -3);
  const rotateY = useTransform(cp, () => mouse.x * 5);

  const handleCopy = useCallback((text: string, type: "email" | "phone" | "location") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2000);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSent(false), 4000);
    }, 1200);
  };

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
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${50 + mouse.x * 15}% ${45 + mouse.y * 12}%, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.65) 55%, #020617 100%)`,
          transition: "background 0.2s ease",
        }}
      />

      {/* Grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Subtle Orbital Background Rings */}
      <div
        className="absolute right-[-10%] top-[20%] w-[680px] h-[680px] rounded-full border border-cyan-400/15 pointer-events-none"
        style={{ transform: "rotateX(65deg) rotateY(15deg) translateZ(-80px)" }}
      >
        <div className="absolute top-10 left-20 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute bottom-16 right-24 w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_#c084fc]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex items-center justify-between w-full pt-1">
        {/* Top Left: Chapter Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-medium">
            CHAPTER 06 / CONTACT
          </span>
        </div>

        {/* Top Right: Friendly Tagline */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/60">
          <span>Let's build something amazing together</span>
          <span className="text-sm">👋</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN CONTACT STAGE */}
      {/* ========================================================================= */}
      <motion.div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full max-w-7xl mx-auto my-auto py-2"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* LEFT COLUMN: IDENTITY & CONTACT INFORMATION (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left" style={{ transform: "translateZ(30px)" }}>
          {/* Header Tag */}
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase mb-2">
            LET'S CONNECT
          </span>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 leading-[1.05]">
            Let's Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500">
              Something Amazing
            </span>
          </h2>

          {/* Description */}
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-md mb-5 font-light tracking-wide">
            I'm always open to discussing new opportunities, innovative projects, or just having a friendly chat about technology and AI.
          </p>

          {/* Contact Information Section Header */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300/80 font-bold uppercase tracking-wider mb-2.5">
            <span>👤</span>
            <span>CONTACT INFORMATION</span>
          </div>

          {/* 3 Contact Cards */}
          <div className="space-y-2 w-full max-w-md mb-4">
            {/* Email Card */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">
                    EMAIL
                  </span>
                  <a
                    href="mailto:trunghieu10a1thptll@gmail.com"
                    className="text-xs font-mono text-white/90 font-medium hover:text-cyan-300 transition-colors"
                  >
                    trunghieu10a1thptll@gmail.com
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy("trunghieu10a1thptll@gmail.com", "email")}
                title="Copy Email"
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 text-white/60 hover:text-white transition-all cursor-pointer text-xs"
              >
                {copiedEmail ? (
                  <span className="text-[10px] text-cyan-300 font-mono font-bold">Copied!</span>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Phone Card */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">
                    PHONE
                  </span>
                  <a
                    href="tel:+84384090045"
                    className="text-xs font-mono text-white/90 font-medium hover:text-cyan-300 transition-colors"
                  >
                    +84 384 090 045
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy("+84 384 090 045", "phone")}
                title="Copy Phone Number"
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 text-white/60 hover:text-white transition-all cursor-pointer text-xs"
              >
                {copiedPhone ? (
                  <span className="text-[10px] text-cyan-300 font-mono font-bold">Copied!</span>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Location Card */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">
                    LOCATION
                  </span>
                  <span className="text-xs font-mono text-white/90 font-medium">
                    Viet Nam, GMT+7
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy("Viet Nam, GMT+7", "location")}
                title="Copy Location"
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 text-white/60 hover:text-white transition-all cursor-pointer text-xs"
              >
                {copiedLocation ? (
                  <span className="text-[10px] text-cyan-300 font-mono font-bold">Copied!</span>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Connect With Me Buttons */}
          <div className="w-full max-w-md mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1.5">
              CONNECT WITH ME
            </span>
            <div className="grid grid-cols-4 gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-950/70 border border-white/10 text-white/80 hover:text-cyan-300 hover:border-cyan-400/40 text-xs font-mono transition-all backdrop-blur-sm"
                >
                  {s.icon}
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Inspirational Statement Card */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-white/10 w-full max-w-md flex items-start gap-2.5">
            <span className="text-xl text-cyan-400/80 leading-none">❝</span>
            <div className="text-[11px] text-white/60 leading-relaxed">
              <p>Great things in business are never done by one person. They're done by a team of people.</p>
              <span className="text-cyan-400/70 font-mono text-[10px] block mt-0.5">— Steve Jobs</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONTACT FORM CARD (7 cols on lg) */}
        <div className="lg:col-span-7 flex justify-center" style={{ transform: "translateZ(40px)" }}>
          <div className="w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-cyan-400/30 shadow-[0_20px_70px_rgba(0,180,255,0.18)] backdrop-blur-2xl relative">
            {/* Form Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/20 to-purple-500/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
                <svg className="w-5 h-5 -rotate-45 ml-0.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  Send Me a Message
                </h3>
                <p className="text-xs text-white/50 font-light">
                  I'll get back to you as soon as possible.
                </p>
              </div>
            </div>

            {/* Actual Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                      👤
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                    Your Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                      ✉️
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Subject */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                  Subject
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                    📁
                  </span>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                  Your Message
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-white/40 text-xs">
                    ✏️
                  </span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-mono resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white font-bold text-xs font-mono uppercase tracking-widest hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : isSent ? (
                  <span className="text-emerald-300">Message Sent Successfully! ✓</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <span className="text-sm">✈️</span>
                  </>
                )}
              </button>

              {/* Privacy Statement */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/45 font-mono pt-1 text-center">
                <span className="text-cyan-400 text-xs">🛡️</span>
                <span>Your information is safe with me. I respect your privacy.</span>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM VALUE HIGHLIGHTS & FOOTER */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-7xl mx-auto pt-2 pb-1">
        {/* Value Highlights Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-3">
          {valueHighlights.map((val, idx) => (
            <div
              key={idx}
              className={`p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border backdrop-blur-md flex items-center gap-3 ${val.accent}`}
            >
              <div className="p-2 rounded-lg bg-white/[0.04] flex items-center justify-center">
                {val.icon}
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-white block leading-tight">
                  {val.title}
                </span>
                <span className="text-[9px] text-white/50 tracking-wide block mt-0.5">
                  {val.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Thank You */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
            THANK YOU FOR VISITING
          </span>
          <div className="w-10 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 mt-1" />
        </div>
      </div>
    </motion.div>
  );
});
