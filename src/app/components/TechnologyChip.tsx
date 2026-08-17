import { memo } from "react";
import reactIcon from "../../assets/tech-icons/react.svg";
import typescriptIcon from "../../assets/tech-icons/typescript.svg";
import viteIcon from "../../assets/tech-icons/vite.svg";
import tailwindIcon from "../../assets/tech-icons/tailwind.svg";
import framerMotionIcon from "../../assets/tech-icons/framer-motion.svg";
import reactRouterIcon from "../../assets/tech-icons/react-router.svg";
import springBootIcon from "../../assets/tech-icons/spring-boot.svg";
import javaIcon from "../../assets/tech-icons/java.svg";
import openaiIcon from "../../assets/tech-icons/openai.svg";
import awsIcon from "../../assets/tech-icons/aws.svg";
import dockerIcon from "../../assets/tech-icons/docker.svg";
import tauriIcon from "../../assets/tech-icons/tauri.svg";
import rustIcon from "../../assets/tech-icons/rust.svg";
import ipcIcon from "../../assets/tech-icons/ipc.svg";
import htmlIcon from "../../assets/tech-icons/html5.svg";
import cssIcon from "../../assets/tech-icons/css3.svg";
import jsIcon from "../../assets/tech-icons/javascript.svg";
import phpIcon from "../../assets/tech-icons/php.svg";
import mysqlIcon from "../../assets/tech-icons/mysql.svg";
import pythonIcon from "../../assets/tech-icons/python.svg";
import opencvIcon from "../../assets/tech-icons/opencv.svg";
import yoloIcon from "../../assets/tech-icons/yolo.svg";
import pytorchIcon from "../../assets/tech-icons/pytorch.svg";
import nodeIcon from "../../assets/tech-icons/nodejs.svg";
import antigravityIcon from "../../assets/tech-icons/antigravity.svg";
import codexIcon from "../../assets/tech-icons/codex.svg";
import claudeCodeIcon from "../../assets/tech-icons/claude-code.svg";

export const techIcons: Record<string, string> = {
  React: reactIcon,
  TypeScript: typescriptIcon,
  JavaScript: jsIcon,
  JS: jsIcon,
  HTML: htmlIcon,
  HTML5: htmlIcon,
  CSS: cssIcon,
  CSS3: cssIcon,
  Vite: viteIcon,
  "Tailwind CSS": tailwindIcon,
  "Tailwind v4": tailwindIcon,
  "Framer Motion": framerMotionIcon,
  "React Router": reactRouterIcon,
  "Spring Boot": springBootIcon,
  Java: javaIcon,
  PHP: phpIcon,
  MySQL: mysqlIcon,
  Python: pythonIcon,
  OpenCV: opencvIcon,
  YOLO: yoloIcon,
  PyTorch: pytorchIcon,
  "Node.js": nodeIcon,
  OpenAI: openaiIcon,
  AWS: awsIcon,
  Docker: dockerIcon,
  Tauri: tauriIcon,
  Rust: rustIcon,
  IPC: ipcIcon,
  Antigravity: antigravityIcon,
  Codex: codexIcon,
  "Claude Code": claudeCodeIcon,
};

interface TechnologyChipProps {
  name: string;
  size?: "sm" | "md";
  className?: string;
}

export const TechnologyChip = memo(function TechnologyChip({
  name,
  size = "md",
  className = "",
}: TechnologyChipProps) {
  const icon = techIcons[name];

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[9px] gap-1 rounded-full"
      : "px-3 py-1.5 text-xs gap-2 rounded-xl";

  const iconSizes = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <span
      className={`inline-flex items-center bg-slate-900/80 border border-white/10 text-white/90 font-mono tracking-wide backdrop-blur-md shadow-sm hover:border-cyan-400/50 hover:text-white transition-all select-none ${sizeClasses} ${className}`}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          className={`${iconSizes} object-contain flex-shrink-0`}
          loading="lazy"
        />
      )}
      <span className="font-medium">{name}</span>
    </span>
  );
});
