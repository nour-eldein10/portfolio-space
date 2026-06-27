import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/lib/cms";

export function ContactFooter() {
  const { data: profile } = useQuery(profileQuery);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const letters = ref.current!.querySelectorAll<HTMLElement>("[data-letter]");
      gsap.set(letters, { yPercent: 110, opacity: 0 });
      gsap.to(letters, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: undefined, // no ScrollTrigger plugin; trigger on intersection below
      });
    }, ref);

    // Simple IntersectionObserver-driven replay
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            gsap.fromTo(
              ref.current!.querySelectorAll("[data-letter]"),
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.04,
              },
            );
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => {
      obs.disconnect();
      ctx.revert();
    };
  }, []);

  const big = "LET'S MAKE";
  return (
    <footer
      id="contact"
      ref={ref}
      className="relative overflow-hidden pt-28 pb-12 bg-background"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(70% 50% at 30% 100%, color-mix(in oklab, var(--amber) 22%, transparent), transparent 70%), radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--neon) 15%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
          <span className="text-[color:var(--neon)]">●</span> Booking Q1 2026
        </p>

        <h2 className="mt-8 font-display font-medium leading-[0.9] tracking-[-0.04em] text-[clamp(3rem,13vw,11rem)]">
          <span className="block overflow-hidden">
            {big.split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span data-letter className="inline-block">
                  {c === " " ? "\u00A0" : c}
                </span>
              </span>
            ))}
          </span>
          <span className="block overflow-hidden">
            <span
              data-letter
              className="inline-block font-serif-italic text-[color:var(--amber)]"
            >
              something impactful
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              data-letter
              className="inline-block font-serif-italic text-[color:var(--amber)]"
            >
              together.
            </span>
          </span>
        </h2>

        <div className="mt-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-3xl hairline p-6 sm:p-8 bg-surface/40 backdrop-blur-sm flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Name
                </span>
                <input
                  className="bg-transparent border-b hairline py-2 focus:border-[color:var(--neon)] outline-none text-sm"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  className="bg-transparent border-b hairline py-2 focus:border-[color:var(--neon)] outline-none text-sm"
                  placeholder="you@domain.com"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Phone (Optional)
                </span>
                <input
                  type="tel"
                  className="bg-transparent border-b hairline py-2 focus:border-[color:var(--neon)] outline-none text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Budget
                </span>
                <select defaultValue="" className="bg-transparent border-b hairline py-2 focus:border-[color:var(--neon)] outline-none text-sm text-foreground/70 appearance-none">
                  <option value="" disabled>Select a range</option>
                  <option value="<1k">&lt; $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k+">$10,000+</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Project Type
              </span>
              <input
                className="bg-transparent border-b hairline py-2 focus:border-[color:var(--neon)] outline-none text-sm"
                placeholder="Mobile App, Automation, Design..."
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Message
              </span>
              <textarea
                rows={4}
                className="bg-transparent border-b hairline py-2 focus:border-[color:var(--neon)] outline-none text-sm resize-none"
                placeholder="Tell me about your vision..."
              />
            </label>
            <button className="mt-2 self-start group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-2 py-2 text-sm font-medium hover:bg-[color:var(--amber)] transition-colors">
              Send brief
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground group-hover:rotate-45 transition-transform">
                →
              </span>
            </button>
          </form>

          <div className="flex flex-col justify-between gap-10">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-2 block font-display text-xl tracking-tight hover:text-[color:var(--neon)] transition-colors"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Based
                </p>
                <p className="mt-2 font-display text-xl tracking-tight">
                  {profile.location}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "WhatsApp", url: "https://wa.me/yournumber" },
                { name: "Email", url: `mailto:${profile.email}` },
                { name: "LinkedIn", url: "https://linkedin.com/in/noureldein" },
                { name: "GitHub", url: "https://github.com/noureldein" },
                { name: "Behance", url: "https://behance.net/noureldein" }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full hairline px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-[color:var(--neon)] transition-colors"
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          <br />
          <span> flutter,automation ?Just call me ! I will grant your wish! </span>
          <span> Nour Eldein © All Rights Reserved -2026 </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon)] animate-pulse" />
            Apps that inspire,Code that empowers ✨
          </span>
          <br />
        </div>
        <br />

      </div>

    </footer>
  );
}