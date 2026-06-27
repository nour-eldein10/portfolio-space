import { motion, useScroll, useTransform } from "motion/react";

/**
 * A fixed scroll-progress bar at the top of the viewport.
 * Fills from left to right with the neon accent color as the user scrolls.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--neon), var(--amber))",
      }}
    />
  );
}
