import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { designsQuery } from "@/lib/cms";
import { SectionHeader } from "./section-header";

export function Designs() {
  const { data: designs } = useQuery(designsQuery);
  return (
    <section id="designs" className="py-28 sm:py-36 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="04"
          eyebrow="Design archive"
          title={
            <>
              Identities, posters and{" "}
              <span className="font-serif-italic text-[color:var(--neon)]">
                things I print large.
              </span>
            </>
          }
        />
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {designs.map((d, i) => (
            <motion.figure
              key={d.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl hairline"
            >
              <Link to="/designs/$slug" params={{ slug: d.id }} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={d.cover}
                    alt={d.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between bg-gradient-to-t from-background/95 via-background/40 to-transparent">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                      {d.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg tracking-tight">{d.title}</h3>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-[color:var(--neon)] transition-colors">
                    ↗
                  </span>
                </figcaption>
              </Link>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
