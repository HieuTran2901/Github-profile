import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });
  const hoveredRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => { hoveredRef.current = true; };
    const onLeave = () => { hoveredRef.current = false; };

    document.addEventListener("mouseover", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.getAttribute("data-hover")) {
        hoveredRef.current = true;
      }
    });
    document.addEventListener("mouseout", () => { hoveredRef.current = false; });

    let frame: number;
    const animate = () => {
      const { x, y } = posRef.current;
      trailRef.current.x += (x - trailRef.current.x) * 0.1;
      trailRef.current.y += (y - trailRef.current.y) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      }
      if (ringRef.current) {
        const scale = hoveredRef.current ? 1.8 : 1;
        ringRef.current.style.transform = `translate(${trailRef.current.x - 18}px, ${trailRef.current.y - 18}px) scale(${scale})`;
        ringRef.current.style.opacity = hoveredRef.current ? "0.8" : "0.45";
        ringRef.current.style.borderColor = hoveredRef.current ? "rgba(168,85,247,0.8)" : "rgba(56,189,248,0.6)";
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#38bdf8",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          boxShadow: "0 0 8px rgba(56,189,248,0.8)",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid rgba(56,189,248,0.6)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          transition: "border-color 0.2s ease, opacity 0.2s ease, transform 0.15s ease",
        }}
      />
    </>
  );
}
