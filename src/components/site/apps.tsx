import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { appsQuery } from "@/lib/cms";
import { SectionHeader } from "./section-header";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[color:var(--amber)] text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? "" : "opacity-25"}>
          ★
        </span>
      ))}
      <span className="ml-1.5 text-muted-foreground font-mono text-[11px]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function Apps() {
  const { data: apps } = useQuery(appsQuery);
  return (
    <section id="apps" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeader
            index="03"
            eyebrow="App marketplace"
            title={
              <>
                Products on the{" "}
                <span className="font-serif-italic text-[color:var(--amber)]">
                  App Store
                </span>{" "}
                & Play.
              </>
            }
          />
          <Link
            to="/apps"
            className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {apps.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: i % 3 === 0 ? -40 : (i % 3 === 2 ? 40 : 0), y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/apps/$slug"
                params={{ slug: a.id }}
                className="group relative flex flex-col hairline rounded-3xl bg-surface/40 overflow-hidden hover:bg-surface/80 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.08)] hover:-translate-y-1.5 transition-all duration-500"
              >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={a.cover}
                  alt={a.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-700 ease-out"
                />
                <div
                  className="absolute inset-0 transition-colors duration-500"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 30%, color-mix(in oklab, var(--background) 95%, transparent) 100%)",
                  }}
                />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg backdrop-blur-md bg-background/40 hairline group-hover:scale-110 transition-transform duration-500 ${
                      a.accent === "amber"
                        ? "text-[color:var(--amber)] shadow-[0_0_20px_-5px_var(--amber)]"
                        : "text-[color:var(--neon)] shadow-[0_0_20px_-5px_var(--neon)]"
                    }`}
                  >
                    {a.icon}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/70 backdrop-blur-md bg-background/40 rounded-full px-2.5 py-1 hairline group-hover:bg-background/60 transition-colors">
                    {a.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-display text-2xl tracking-tight group-hover:text-[color:var(--neon)] transition-colors">{a.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors">{a.tagline}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Stars rating={a.rating} />
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {a.reviews} reviews
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t hairline group-hover:border-foreground/20 transition-colors">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    {a.downloads}
                  </span>
                  <span className="group/btn inline-flex items-center gap-2 text-sm font-medium group-hover:text-[color:var(--neon)] transition-colors">
                    View
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full hairline group-hover/btn:border-[color:var(--neon)] group-hover/btn:translate-x-0.5 transition-all">
                      ↗
                    </span>
                  </span>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}