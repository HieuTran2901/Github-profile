# AI Full Stack Developer Portfolio — 3D Spatial Storytelling Experience

> A high-performance, cinematic 8-chapter developer portfolio engineered with **React**, **TypeScript**, **Framer Motion**, and **CSS 3D Spatial Transforms**. Designed with a **Pure MotionValue Architecture** that decouples continuous scroll animations from the React rendering cycle to achieve a 60 FPS GPU-composited experience with zero continuous React re-renders.

---

## 🌟 Live Demo & Portfolio Highlights

- **Developer**: Tran Huu Trung Hieu (AI Full Stack Developer)
- **Tech Stack Focus**: Java, Spring Boot, React, TypeScript, OpenAI/LLMs, AWS, Docker, Microservices
- **Story Arc**: 8 Immersive Storytelling Chapters (Intro → Journey → Skills → Featured Project → Gallery → Workflow → Stats → Contact)

---

## 🏗 System Architecture & Engineering Approach

```
Native Browser Scroll (Document Height: 800vh)
       │
       ▼
Framer Motion `scrollYProgress`
       │
       ▼
Global `motionProgress` (MotionValue<number>)
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼                         ▼                         ▼
`useTransform` (Chapter 1–8)  `useTransform` (UI)     `useMotionValueEvent`
(rotateX, rotateY, depth)    (Progress bar, hint)   (Discrete State Only)
       │                         │                         │
       ▼                         ▼                         ▼
motion.div (GPU Composite)    motion.div               React `setActiveChapter`
(0 FPS React Re-renders)     (0 FPS React Re-renders)  (Fires ONLY on Chapter Change)
```

### Key Engineering Decisions:
1. **Pure MotionValue Scroll Engine**:
   - Continuous scroll progress is driven directly by Framer Motion `MotionValue` signals via `useTransform`.
   - Bypasses React state (`useState`/`setState` per frame), eliminating layout thrashing and forced reflows.
2. **CSS 3D Spatial Depth System**:
   - Each scene establishes a unified `perspective: 1200px` container with `transform-style: preserve-3d`.
   - Z-axis layering (Background: `-120px`, Midground: `+30px`, Foreground: `+60px` to `+80px`) creates a cinematic depth hierarchy without WebGL overhead.
3. **Throttled Mouse Parallax**:
   - `mousemove` events are throttled with `requestAnimationFrame` to cap state updates at 60 FPS, mitigating CPU spikes on high-polling rate (1000Hz) gaming mice.

---

## 📖 Chapter Breakdown & Recruiter Story Arc

1. **Chapter 01 / Introduction**: Identity, role positioning, and core value proposition.
2. **Chapter 02 / Journey**: 3D timeline mapping career and learning progression from 2019 to 2024.
3. **Chapter 03 / Skills**: Interactive 3D skill grid categorized into Frontend, Backend, AI/ML, and DevOps capability clusters.
4. **Chapter 04 / Featured Project**: Deep dive into *AI Travel Marketplace* with metrics (500+ Active Users, 95% AI Accuracy, 3s Response, 99% SLA), architecture, tech stack, and live CTAs.
5. **Chapter 05 / Project Gallery**: Interactive 3D Spatial Deck Flip carousel showcasing 4 real-world projects (Distributed Chat Engine, Smart Analytics, Microservices).
6. **Chapter 06 / Workflow**: 6-step engineering methodology pipeline (Idea → Architecture → Backend → Frontend → AI Layer → Deployment).
7. **Chapter 07 / Statistics**: Quantified developer activity (3+ years exp, 15+ projects shipped, 100k+ lines of code) + 52-week GitHub contribution activity.
8. **Chapter 08 / Contact**: Elevated CTA focal point with direct email contact and secure social profile links.

---

## ⚡ Performance & Accessibility Metrics

- **Build Time**: ~2.5s via Vite & ESBuild
- **Continuous React Scroll Re-renders**: **0**
- **Console Errors**: **0**
- **Accessibility**: Support for `@media (prefers-reduced-motion: reduce)`, native keyboard navigation (PageUp, PageDown, Arrows, Home, End), and `rel="noopener noreferrer"` link security.

---

## 🛠 Local Development & Build Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/developer-portfolio-storytelling.git

# Navigate to project directory
cd developer-portfolio-storytelling

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory ready for deployment on **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 🚀 Deployment Instructions

### Deploying to Vercel
```bash
npx vercel
```

### Deploying to Netlify
```bash
npx netlify-cli deploy --prod
```

---

## 📄 License
Licensed under the [MIT License](LICENSE).