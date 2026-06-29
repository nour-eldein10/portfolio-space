import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, useScroll, useTransform } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Particles } from "./particles";
import { profileQuery } from "@/lib/cms";
import logo from "@/assets/logo.webp";

export function Hero() {
  const { data: profile } = useQuery(profileQuery);
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [idx, setIdx] = useState(0);

  const { scrollY } = useScroll();
  const yHeroText = useTransform(scrollY, [0, 600], [0, 150]);
  const yHeroImage = useTransform(scrollY, [0, 600], [0, 250]);
  const opacityHero = useTransform(scrollY, [400, 1000], [1, 0]);

  // Cycle rotating roles
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % profile.rotatingRoles.length), 2400);
    return () => clearInterval(id);
  }, []);

  // GSAP entry timeline for headline + meta
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-hero-line]", { yPercent: 110, opacity: 0 });
      gsap.set("[data-hero-meta]", { y: 24, opacity: 0 });
      gsap.set("[data-hero-portrait]", { scale: 1.08, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to("[data-hero-portrait]", { scale: 1, opacity: 1, duration: 1.6 }, 0)
        .to("[data-hero-line]", { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.09 }, 0.15)
        .to("[data-hero-meta]", { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.55);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden grain isolate"
    >
      {/* Atmospheric gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 20%, color-mix(in oklab, var(--amber) 22%, transparent), transparent 70%), radial-gradient(45% 40% at 10% 80%, color-mix(in oklab, var(--neon) 18%, transparent), transparent 70%)",
        }}
      />
      <Particles
        className="absolute inset-0 -z-10 w-full h-full opacity-90"
        color="rgba(120, 230, 255, 0.85)"
      />

      <br />
  
      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
        <motion.div style={{ y: yHeroText, opacity: opacityHero }}>
          <p
            data-hero-meta
            className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-6"
          >
            <span className="text-[color:var(--neon)]">●</span> Currently — Building software that
            grows businesses
          </p>

          <h1
            ref={headlineRef}
            className="font-display font-medium text-[clamp(2rem,6.5vw,5.2rem)] leading-[0.95] tracking-[-0.035em] text-balance"
          >
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                Hi, I'm{" "}
                <span className="font-serif-italic text-[color:var(--amber)]">Nour Eldein</span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                I am a
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                <span
                  className="relative inline-block align-baseline overflow-hidden whitespace-nowrap"
                  style={{ height: "1em" }}
                >
                  {/* invisible sizer = longest role keeps width stable */}
                  <span aria-hidden className="invisible font-serif-italic whitespace-nowrap">
                    {profile.rotatingRoles
                      .reduce((a, b) => (a.length > b.length ? a : b))
                      .toLowerCase()}
                    .
                  </span>
                  {profile.rotatingRoles.map((r, i) => (
                    <motion.span
                      key={r}
                      initial={false}
                      animate={{
                        y: i === idx ? "0%" : i < idx ? "-110%" : "110%",
                        opacity: i === idx ? 1 : 0,
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 whitespace-nowrap font-serif-italic text-[color:var(--neon)]"
                      style={{
                        textShadow: "0 0 30px color-mix(in oklab, var(--neon) 35%, transparent)",
                      }}
                    >
                      {r.toLowerCase()}.
                    </motion.span>
                  ))}
                </span>
              </span>
            </span>
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 max-w-xl">
            <p
              data-hero-meta
              className="text-[15px] leading-relaxed text-muted-foreground text-pretty"
            >
              {profile.bio}
            </p>
          </div>

          <div data-hero-meta className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/apps"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-2 py-2 text-sm font-medium hover:bg-[color:var(--amber)] transition-colors"
            >
              Explore My Work
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground group-hover:rotate-45 transition-transform">
                →
              </span>
            </Link>
            <Link
              to="/services"
              className="group relative p-[2px] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(120,230,255,0.35)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--neon)] via-[color:var(--amber)] to-[color:var(--neon)] bg-[length:200%_auto] group-hover:bg-right transition-all duration-500 rounded-full" />
              <span className="relative flex items-center justify-center px-6 py-2.5 rounded-full bg-background/95 group-hover:bg-background/90 transition-colors">
                <span className="absolute top-1.5 left-6 text-[8px] font-mono text-muted-foreground/30 leading-none">+</span>
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-muted-foreground/30 leading-none">+</span>
                <span className="absolute top-1.5 right-6 text-[8px] font-mono text-muted-foreground/30 leading-none">+</span>
                <span 
                  className="font-display font-medium text-sm text-foreground tracking-tight transition-all duration-300"
                  style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7)" }}
                >
                  View Services
                </span>
              </span>
            </Link>
            <Link
              to="/contact"
              className="group relative p-[2px] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(209,160,84,0.35)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--amber)] via-[color:var(--neon)] to-[color:var(--amber)] bg-[length:200%_auto] group-hover:bg-right transition-all duration-500 rounded-full" />
              <span className="relative flex items-center justify-center px-6 py-2.5 rounded-full bg-background/95 group-hover:bg-background/90 transition-colors">
                <span className="absolute top-1.5 left-6 text-[8px] font-mono text-muted-foreground/30 leading-none">+</span>
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-muted-foreground/30 leading-none">+</span>
                <span className="absolute top-1.5 right-6 text-[8px] font-mono text-muted-foreground/30 leading-none">+</span>
                <span 
                  className="font-display font-medium text-sm text-foreground tracking-tight transition-all duration-300"
                  style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7)" }}
                >
                  Contact Me
                </span>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          data-hero-portrait
          style={{ y: yHeroImage, opacity: opacityHero }}
          className="relative aspect-[4/5] w-full max-w-[18rem] justify-self-center lg:justify-self-end"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[color:var(--neon)]/30 via-transparent to-[color:var(--amber)]/30 blur-2xl opacity-60" />
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] hairline bg-surface flex items-center justify-center">
            <img src={profile.portrait} alt={profile.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--background) 30%, transparent) 0%, transparent 35%, color-mix(in oklab, var(--background) 85%, transparent) 100%)",
              }}
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between font-mono text-[10px] tracking-widest uppercase text-foreground/80">
              <span>N.E.A</span>
              <span>Mansoura / Remote</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating doodle shapes */}
      <motion.div
        aria-hidden
        className="absolute top-1/4 left-[8%] w-20 h-20 border border-[color:var(--neon)]/20 rounded-full -z-[5]"
        animate={{ y: [0, -20, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[60%] right-[12%] w-12 h-12 border border-[color:var(--amber)]/20 -z-[5]"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
        animate={{ y: [0, 15, 0], rotate: [0, -120, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[25%] left-[15%] w-3 h-3 bg-[color:var(--neon)]/30 rounded-full -z-[5]"
        animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[35%] right-[25%] w-2 h-2 bg-[color:var(--amber)]/30 rounded-full -z-[5]"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Scroll cue — animated bounce */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          scroll
        </span>
        <motion.svg width="20" height="30" viewBox="0 0 20 30" className="text-muted-foreground">
          <rect
            x="6"
            y="0"
            width="8"
            height="20"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <motion.circle
            cx="10"
            cy="8"
            r="2"
            fill="currentColor"
            animate={{ cy: [6, 14, 6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
