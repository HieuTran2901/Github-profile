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

export const techIcons: Record<string, string> = {
  React: reactIcon,
  TypeScript: typescriptIcon,
  Vite: viteIcon,
  "Tailwind CSS": tailwindIcon,
  "Tailwind v4": tailwindIcon,
  "Framer Motion": framerMotionIcon,
  "React Router": reactRouterIcon,
  "Spring Boot": springBootIcon,
  Java: javaIcon,
  OpenAI: openaiIcon,
  AWS: awsIcon,
  Docker: dockerIcon,
  Tauri: tauriIcon,
  Rust: rustIcon,
  IPC: ipcIcon,
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
      ? "px-2 py-0.5 text-[9px] gap-1"
      : "px-2.5 py-1 text-[10px] gap-1.5";

  const iconSizes = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      className={`inline-flex items-center rounded-full bg-slate-900/80 border border-white/10 text-white/80 font-mono tracking-wide backdrop-blur-md shadow-sm hover:border-cyan-400/40 hover:text-white transition-all select-none ${sizeClasses} ${className}`}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          className={`${iconSizes} object-contain flex-shrink-0`}
          loading="lazy"
        />
      )}
      <span>{name}</span>
    </span>
  );
});
