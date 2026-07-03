"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { appsQuery } from "@/lib/cms";
import { SectionHeader } from "./section-header";

// ─── Scroll Direction Hook ──────────────────────────────────────────────────
function useScrollDirection() {
  const [direction, setDirection] = useState<"down" | "up">("down");
  const lastY = useRef(0);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      if (y > lastY.current + 2) setDirection("down");
      else if (y < lastY.current - 2) setDirection("up");
      lastY.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return direction;
}

// ─── Animated App Card ──────────────────────────────────────────────────────
function AppCard({
  a,
  index,
  scrollDirection,
  prefersReduced,
}: {
  a: any;
  index: number;
  scrollDirection: "down" | "up";
  prefersReduced: boolean;
}) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  // Determine off-screen X based on card position + scroll direction
  const getHiddenX = useCallback(
    (dir: "down" | "up") => {
      if (prefersReduced) return 0;
      // Scrolling down  → cards come from their natural sides (even=left, odd=right)
      // Scrolling up    → cards come from the opposite sides (reverse)
      if (dir === "down") return isLeft ? -72 : 72;
      return isLeft ? 72 : -72;
    },
    [isLeft, prefersReduced],
  );

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Card entered viewport → animate in
          controls.start({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 120,
              damping: 18,
              mass: 0.8,
              delay: index * 0.04,
            },
          });
        } else {
          // Card left viewport → snap to the hidden position for current scroll direction
          controls.start({
            opacity: 0,
            x: getHiddenX(scrollDirection),
            scale: prefersReduced ? 1 : 0.88,
            transition: { duration: 0.15, ease: "easeIn" },
          });
        }
      },
      { threshold: 0.12, rootMargin: "-20px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls, scrollDirection, getHiddenX, index, prefersReduced]);

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, x: getHiddenX("down"), scale: 0.88 }
      }
      animate={controls}
    >
      <Link to="/apps/$slug" params={{ slug: a.id }} className="group flex flex-col gap-3">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-3xl sm:rounded-[2rem] hairline shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300">
          <img src={a.cover} alt={a.name} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex flex-col px-1">
          <h3 className="font-medium text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-[color:var(--neon)] transition-colors duration-200">
            {a.name}
          </h3>
          <div className="flex items-center text-[13px] text-muted-foreground mt-0.5 gap-1">
            <span>{a.rating?.toFixed(1) || "5.0"}</span>
            <span className="text-[10px]">★</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Apps Section ───────────────────────────────────────────────────────────
export function Apps() {
  const { data: apps } = useQuery(appsQuery);
  const scrollDirection = useScrollDirection();
  const prefersReduced = useReducedMotion() ?? false;

  return (
    <section id="apps" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeader index="03" eyebrow="App marketplace" title={<>featured Apps</>} />
          <Link
            to="/apps"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {apps.map((a, i) => (
            <AppCard
              key={a.id}
              a={a}
              index={i}
              scrollDirection={scrollDirection}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
