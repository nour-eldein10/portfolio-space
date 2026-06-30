import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { productsQuery } from "@/lib/cms";
import { SectionHeader } from "./section-header";

export function Products() {
  const { data: featuredProducts } = useQuery(productsQuery);
  return (
    <section id="work" className="py-28 sm:py-36 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          title={
            <>
              Things I built that I'd{" "}
              <span className="font-serif-italic text-[color:var(--neon)]">still ship today.</span>
            </>
          }
        />

        <div className="mt-16 space-y-6">
          {featuredProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group relative grid md:grid-cols-[1fr_auto] gap-8 items-end hairline rounded-3xl bg-background p-6 sm:p-10 overflow-hidden hover:border-[color:var(--neon)]/60 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-500"
            >
              <div
                aria-hidden
                className="absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl opacity-25 group-hover:opacity-70 group-hover:scale-125 transition-all duration-700"
                style={{
                  background: p.accent === "amber" ? "var(--amber)" : "var(--neon)",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  <span>{p.year}</span>
                  <span className="h-px w-6 bg-border" />
                  <span>{p.role}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl sm:text-5xl tracking-[-0.02em] group-hover:text-foreground transition-colors">
                  {p.name}
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {p.summary}
                </p>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.id }}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-foreground group-hover:gap-4 group-hover:text-[color:var(--neon)] transition-all duration-300"
                >
                  Case study
                  <span className="font-mono">→</span>
                </Link>
              </div>
              <div className="relative h-56 sm:h-64 w-full md:w-72 overflow-hidden rounded-2xl hairline shadow-2xl">
                <img
                  src={p.cover}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
