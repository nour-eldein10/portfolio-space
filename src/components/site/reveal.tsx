import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { ReactNode } from "react";

type AnimVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur"
  | "jump"
  | "rotate";

const variants: Record<AnimVariant, { hidden: object; visible: object }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(16px)", scale: 0.97 },
    visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
  },
  jump: {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -4, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

interface RevealProps {
  children: ReactNode;
  variant?: AnimVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

/**
 * Wraps children in a scroll-triggered reveal animation.
 * Animates in on enter and reverses on scroll-out when once=false.
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.55,
  className,
  once = false,
  margin = "-80px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  variant?: AnimVariant;
  stagger?: number;
  once?: boolean;
  margin?: string;
}

/**
 * Staggered reveal for lists of children. Each child animates in sequence.
 */
export function StaggerReveal({
  children,
  className,
  variant = "fade-up",
  stagger = 0.08,
  once = false,
  margin = "-60px",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={variants[variant]}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
