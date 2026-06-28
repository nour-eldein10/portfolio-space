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
                <span className="font-serif-italic text-[color:var(--amber)]">App Store</span> &
                Play.
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

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {apps.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/apps/$slug"
                params={{ slug: a.id }}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-3xl sm:rounded-[2rem] hairline shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <img
                    src={a.cover}
                    alt={a.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col px-1">
                  <h3 className="font-medium text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-[color:var(--neon)] transition-colors">
                    {a.name}
                  </h3>
                  <div className="flex items-center text-[13px] text-muted-foreground mt-0.5 gap-1">
                    <span>{a.rating?.toFixed(1) || "5.0"}</span>
                    <span className="text-[10px]">★</span>
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
