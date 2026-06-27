import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Wraps a section to create a full-page "reveal" on scroll.
 * The content starts clipped and scales slightly, then unclips
 * and scales to 1 as the section enters the viewport.
 */
export function SectionReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(8% 4% 8% 4% round 2rem)", "inset(0% 0% 0% 0% round 0rem)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath, scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
