import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "motion/react";

export function CustomCursor() {
  const [hasPointer, setHasPointer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isText, setIsText] = useState(false);

  // Mouse position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs — outer ring lags behind for a "trailing" feel
  const trailX = useSpring(mouseX, { damping: 22, stiffness: 200, mass: 0.6 });
  const trailY = useSpring(mouseY, { damping: 22, stiffness: 200, mass: 0.6 });

  // Pulse ring opacity animation ref
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setHasPointer(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setHasPointer(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Pulse animation loop on pulse ring
  useEffect(() => {
    if (!pulseRef.current) return;
    const controls = animate(
      pulseRef.current,
      { opacity: [0.5, 0, 0.5], scale: [1, 1.8, 1] },
      { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
    );
    return () => controls.stop();
  }, [hasPointer, isVisible]);

  useEffect(() => {
    if (!hasPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const checkInteractive = (el: HTMLElement | null): { hover: boolean; text: boolean } => {
          if (!el) return { hover: false, text: false };
          const tag = el.tagName;
          const style = window.getComputedStyle(el);
          if (
            tag === "A" || tag === "BUTTON" || tag === "INPUT" ||
            tag === "SELECT" || tag === "TEXTAREA" ||
            el.getAttribute("role") === "button" ||
            el.classList.contains("cursor-pointer") ||
            style.cursor === "pointer"
          ) return { hover: true, text: false };
          if (style.cursor === "text" || tag === "P" || tag === "SPAN" || tag === "H1" || tag === "H2" || tag === "H3") {
            return { hover: false, text: true };
          }
          return checkInteractive(el.parentElement);
        };
        const { hover, text } = checkInteractive(target);
        setIsHovered(hover);
        setIsText(text && !hover);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [hasPointer, isVisible, mouseX, mouseY]);

  if (!hasPointer || !isVisible) return null;

  const outerSize = isClicked ? 22 : isHovered ? 52 : isText ? 4 : 30;
  const innerSize = isText ? 10 : 5;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body, a, button, [role="button"], input, select, textarea, .cursor-pointer {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Ambient pulse ring — always behind outer */}
      <motion.div
        ref={pulseRef}
        className="pointer-events-none fixed top-0 left-0 rounded-full border border-[color:var(--neon)]/40"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9998,
          width: 30,
          height: 30,
        }}
      />

      {/* Trailing Outer Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 rounded-full border backdrop-blur-[0.5px]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
        }}
        animate={{
          width: outerSize,
          height: outerSize,
          scale: isClicked ? 0.8 : 1,
          rotate: isHovered ? 180 : 0,
          borderColor: isHovered
            ? "rgba(209, 160, 84, 0.9)"
            : isText
            ? "rgba(120, 230, 255, 0.3)"
            : "rgba(0, 35, 43, 0.8)",
          backgroundColor: isHovered
            ? "rgba(209, 160, 84, 0.06)"
            : "rgba(120, 230, 255, 0.02)",
          borderWidth: isHovered ? 1.5 : 1,
        }}
        transition={{
          width: { type: "spring", damping: 18, stiffness: 280 },
          height: { type: "spring", damping: 18, stiffness: 280 },
          rotate: { type: "spring", damping: 15, stiffness: 120 },
          scale: { type: "spring", damping: 20, stiffness: 350 },
          borderColor: { duration: 0.25 },
          backgroundColor: { duration: 0.25 },
        }}
      />

      {/* Inner Dot / Text Cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
        }}
        animate={{
          width: innerSize,
          height: innerSize,
          scale: isClicked ? 2 : isHovered ? 0 : 1,
          backgroundColor: isHovered ? "var(--amber)" : "var(--neon)",
          boxShadow: isHovered
            ? "0 0 12px var(--amber), 0 0 24px rgba(209,160,84,0.4)"
            : "0 0 10px var(--neon), 0 0 20px rgba(120,230,255,0.3)",
          opacity: isText ? 0.6 : 1,
          borderRadius: isText ? "2px" : "9999px",
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 500,
          mass: 0.1,
          backgroundColor: { duration: 0.2 },
          boxShadow: { duration: 0.2 },
          borderRadius: { duration: 0.2 },
          scale: { type: "spring", damping: 20, stiffness: 400 },
        }}
      />
    </>
  );
}
