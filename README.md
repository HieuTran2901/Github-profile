# AI Full Stack Developer Portfolio — 3D Spatial Storytelling Experience

> A high-performance, cinematic **6-Chapter** developer portfolio engineered with **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **CSS 3D Spatial Transforms**. Powered by a **Pure MotionValue Architecture** that decouples continuous scroll-driven animations from React rendering cycles to deliver a fluid 60/120 FPS GPU-composited experience with zero continuous React re-renders.

---

## 🌟 Developer Identity & Highlights

- **Developer**: Tran Huu Trung Hieu (AI Full Stack Developer)
- **Core Specialization**: Java, Spring Boot, React, TypeScript, Python, OpenCV/YOLO, OpenAI/LLMs, Tauri/Rust, Docker, Cloud & Agentic Systems
- **Contact**: `trunghieu10a1thptll@gmail.com` · `+84 384 090 045` · Ho Chi Minh City, Vietnam (UTC+7)
- **Story Structure**: 6 Immersive Storytelling Chapters (Intro → Journey → Skills → Featured Project → Project Gallery → Contact)

---

## 🏗 System Architecture & Engineering Innovations

```
Native Browser Scroll / Wheel Intent / Keyboard / Touch
                        │
                        ▼
Framer Motion `scrollYProgress` (0.0 → 1.0)
                        │
                        ▼
Global `motionProgress` (MotionValue<number> with Liquid useSpring Physics)
                        │
        ┌───────────────┴───────────────┬───────────────────────────────┐
        ▼                               ▼                               ▼
Chapter Transforms (1–6)      Global UI Overlays            Discrete State Triggers
• `useTransform(cp)`          • Top Progress Bar Width       • `useMotionValueEvent`
• Opacity (0 → 1 → 0)         • Scroll Indicator Opacity     • `activeChapter` (0 → 5)
• Spatial Y & Depth Scale     • Chapter Navigation Active    • Chapter Visibility Mounts
• 3D Mouse Parallax Tilt      • Scene Transition Ownership   • 0 Continuous Re-renders
        │                               │                               │
        ▼                               ▼                               ▼
   motion.div                      motion.div                     React DOM Dwell
(GPU Composited)                (GPU Composited)              (Fires ONLY on Chapter Change)
```

### Key Engineering Decisions:
1. **Pure MotionValue Scroll Engine**:
   - Continuous scroll progress is driven directly by Framer Motion `MotionValue` signals via `useTransform`.
   - Bypasses React frame-by-frame state updates (`useState`/`setState`), completely eliminating layout thrashing and forced reflows.
2. **Universal Cinematic Chapter Transition Contract**:
   - Every chapter implements GPU-accelerated enter/exit transforms (`opacity`, `translateY`, `scale: 0.985 → 1.0`) with calibrated progress windows.
   - Dynamic `pointerEvents` ownership prevents inactive or exiting scenes from intercepting clicks or form interactions.
3. **CSS 3D Spatial Depth System**:
   - Each scene utilizes a unified `perspective: 1200px` container with `transformStyle: preserve-3d`.
   - Z-axis layering (Celestial Background: `-90px`, Midground Planet/Orbit: `0px`, Foreground Active Card: `+30px` to `+60px`) provides realistic depth without the CPU/GPU footprint of full WebGL canvases.
4. **Authentic Vector Brand Icon Integration**:
   - Custom `TechnologyChip` component mapping 27+ official vector SVGs (`React`, `TypeScript`, `Java`, `Spring Boot`, `Python`, `Rust`, `Tauri`, `OpenAI`, `Docker`, `AWS`, etc.) across timeline milestones, featured projects, and orbital cards.

---

## 📖 Chapter Breakdown & Recruiter Story Arc

| Chapter | Title | Architectural Type | Description |
| :--- | :--- | :--- | :--- |
| **Chapter 01** | **Introduction** | Scene-Based | Recruiter-friendly hero showcase featuring real avatar (`src/assets/avatar.png`), technical role, core value proposition, direct CTAs (View Projects, Contact, Download CV), and verified capability tags. |
| **Chapter 02** | **Journey** | Beat-Based (5 Stops) | Interactive 3D career timeline (2022: University of Transport and Communications, 2023: Souvenir E-commerce, 2024: Computer Vision & AI Traffic Monitoring, 2025: AI Workflow Integration, 2026: Agentic Workflow & Autonomous Systems) with official brand tech chips and live proof-of-work screenshot drawer. |
| **Chapter 03** | **Skills** | Scene-Based | Interactive 3D orbital competency plane grouping skills into Frontend, Backend, AI & Intelligent Systems, and DevOps/Cloud clusters with detailed modal drilldown. |
| **Chapter 04** | **Featured Project** | Scene-Based | Production deep-dive into *AI Travel Marketplace* featuring verified architecture, real application evidence screenshot (`src/assets/travel2.jpg`), technology stack, and live demonstration links. |
| **Chapter 05** | **Project Gallery** | Beat-Based (3 Beats) | 3D Celestial Planetary Carousel showcasing 3 flagship production projects:<br>• `01` — **AI Study Planner** (*React, TypeScript, Spring Boot, Java*)<br>• `02` — **AI Travel Marketplace** (*Java, Spring Boot, React, TypeScript, OpenAI, AWS, Docker*)<br>• `03` — **Developer Control Center** (*Tauri, Rust, React, TypeScript, Tailwind CSS, IPC*)<br>Features high-level System Identity, verified System Characteristics metadata, and detailed active card showcase. |
| **Chapter 06** | **Contact** | Scene-Based | High-conversion recruiter contact terminal with instant copy-to-clipboard functionality (Email, Phone, Location), availability status badge (`Open to Opportunities`), verified social links (GitHub, LinkedIn), and direct contact form. |

---

## ⚡ Performance & Accessibility Highlights

- **Build Time**: ~2.5s – 4.0s via Vite & ESBuild
- **Continuous React Scroll Re-renders**: **0** (Pure MotionValue pipelines)
- **Lighthouse / Performance**: GPU-accelerated transforms (`will-change: transform, opacity`)
- **Accessibility & Motion Control**:
  - Full support for `@media (prefers-reduced-motion: reduce)`
  - Native keyboard navigation (`ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`, `Home`, `End`)
  - Trackpad gesture smoothing and wheel intent lock guards
  - WCAG AAA contrast ratios across dark space theme

---

## 🛠 Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS 3D Transforms
- **Animation & Physics**: Framer Motion (`MotionValue`, `useTransform`, `useSpring`, `AnimatePresence`)
- **Icons & Assets**: Custom SVG Brand Vectors (`src/assets/tech-icons/`), Lucide Icons
- **Tooling**: ESLint, PostCSS, Autoprefixer

---

## 🚀 Local Development & Build Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` or `pnpm`

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/HieuTran2901/Github-profile.git

# Navigate to project directory
cd Github-profile

# Install dependencies
npm install
```

### 2. Running Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Generates production-optimized static bundles in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📂 Project Structure

```
Github-profile/
├── docs/                               # Phase reports & architectural documentation
│   └── storytelling/
├── public/                             # Public static assets & SVGs
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chapters/
│   │   │   │   ├── Chapter1.tsx        # Chapter 01: Hero / Introduction
│   │   │   │   ├── Chapter2.tsx        # Chapter 02: 3D Career Journey
│   │   │   │   ├── Chapter3.tsx        # Chapter 03: Skills Orbit Plane
│   │   │   │   ├── Chapter4.tsx        # Chapter 04: Featured Project Deep-Dive
│   │   │   │   ├── Chapter5.tsx        # Chapter 05: Planetary Project Gallery
│   │   │   │   └── Chapter6.tsx        # Chapter 06: Recruiter Contact Hub
│   │   │   ├── ChapterNav.tsx          # Floating story progression navigator
│   │   │   └── TechnologyChip.tsx      # Reusable official vector SVG brand chip
│   │   ├── context/
│   │   │   ├── MotionContext.tsx       # Global MotionValue context provider
│   │   │   └── ScrollContext.tsx       # Scroll state context
│   │   └── App.tsx                     # Story engine, snap points, wheel controller
│   ├── assets/                         # Project screenshots, avatar, and tech SVGs
│   │   ├── tech-icons/                 # 27+ official vector brand SVGs
│   │   └── avatar.png                  # Real developer avatar asset
│   ├── index.css                       # Global Tailwind CSS & 3D perspective styles
│   └── main.tsx                        # Application entry point
├── index.html                          # Root HTML template
├── package.json                        # Project scripts and dependencies
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite build configuration
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
