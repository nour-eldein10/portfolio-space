import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { servicesQuery } from "@/lib/cms";
import { SectionHeader } from "./section-header";
import { Link } from "@tanstack/react-router";

export function Services() {
  const { data: services } = useQuery(servicesQuery);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const activeService = services?.find(s => s.n === selectedService);

  return (
    <section id="services" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="01"
          eyebrow="What I do"
          title={
            <>
              Specialized services,{" "}
              <span className="font-serif-italic text-[color:var(--amber)]">
                one studio of one.
              </span>
            </>
          }
          subtitle="I move between code, design and operations on the same project. That's the point — fewer handoffs, faster taste."
        />

        <div className="mt-16 grid lg:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col p-8 sm:p-10 hairline rounded-3xl bg-surface/30 hover:bg-surface/60 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.06)] transition-all duration-500"
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <span className="font-mono text-xs text-muted-foreground tracking-widest bg-surface px-3 py-1 rounded-full hairline">
                  {s.n}
                </span>
                <span className="h-2 w-2 rounded-full bg-[color:var(--neon)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                {s.title}
              </h3>
              
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 flex-1">
                {s.body}
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags?.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] tracking-widest uppercase text-foreground/70 bg-surface-2/50 hairline rounded-full px-2.5 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t hairline">
                  <button 
                    onClick={() => setSelectedService(s.n)}
                    className="flex-1 text-center bg-foreground text-background py-2.5 px-4 rounded-full text-sm font-medium hover:bg-[color:var(--amber)] transition-colors"
                  >
                    View Details
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 text-center hairline py-2.5 px-4 rounded-full text-sm font-medium hover:text-foreground hover:border-[color:var(--neon)] transition-colors"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && activeService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="bg-surface rounded-3xl hairline p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[color:var(--amber)]/20 rounded-full blur-3xl" />
                
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 h-10 w-10 rounded-full hairline flex items-center justify-center hover:bg-surface-2 transition-colors z-10"
                >
                  ✕
                </button>

                <div className="relative z-10">
                  <span className="font-mono text-xs text-muted-foreground tracking-widest bg-background/50 px-3 py-1 rounded-full hairline inline-block mb-6">
                    Service {activeService.n}
                  </span>
                  
                  <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
                    {activeService.title}
                  </h2>
                  
                  <p className="text-[15px] leading-relaxed text-foreground/90 mb-8">
                    {activeService.body}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-8 mb-8">
                    <div className="bg-background/50 p-6 rounded-2xl hairline">
                      <h4 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        Timeline
                      </h4>
                      <p className="font-display text-xl">{(activeService as any).timeline || "Varies by scope"}</p>
                    </div>
                    <div className="bg-background/50 p-6 rounded-2xl hairline">
                      <h4 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        Pricing
                      </h4>
                      <p className="font-display text-xl text-[color:var(--neon)]">{(activeService as any).pricing || "Custom quote"}</p>
                    </div>
                  </div>

                  {(activeService as any).features && (activeService as any).features.length > 0 && (
                    <div className="mb-10">
                      <h4 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        What's Included
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {(activeService as any).features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] shrink-0" />
                            <span className="text-foreground/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-8 border-t hairline flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/contact"
                      className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 px-6 rounded-full text-sm font-medium hover:bg-[color:var(--amber)] transition-colors"
                    >
                      Start this project →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}