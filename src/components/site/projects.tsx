import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { projectsQuery } from "@/lib/cms";
import { SectionHeader } from "./section-header";

export function Projects() {
  const { data: featuredProjects } = useQuery(projectsQuery);
  return (
    <section id="work" className="py-28 sm:py-36 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          title={
            <>
              Things I built that I'd{" "}
              <span className="font-serif-italic text-[color:var(--neon)]">
                still ship today.
              </span>
            </>
          }
        />

        <div className="mt-16 space-y-6">
          {featuredProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative grid md:grid-cols-[1fr_auto] gap-8 items-end hairline rounded-3xl bg-background p-6 sm:p-10 overflow-hidden hover:border-[color:var(--neon)]/40 transition-colors"
            >
              <div
                aria-hidden
                className="absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl opacity-25 group-hover:opacity-50 transition-opacity"
                style={{
                  background:
                    p.accent === "amber"
                      ? "var(--amber)"
                      : "var(--neon)",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  <span>{p.year}</span>
                  <span className="h-px w-6 bg-border" />
                  <span>{p.role}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl sm:text-5xl tracking-[-0.02em]">
                  {p.name}
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {p.summary}
                </p>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.id }}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-foreground group-hover:gap-3 transition-all"
                >
                  Case study
                  <span className="font-mono">→</span>
                </Link>
              </div>
              <div className="relative h-56 sm:h-64 w-full md:w-72 overflow-hidden rounded-2xl hairline">
                <img
                  src={p.cover}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}