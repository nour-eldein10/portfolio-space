import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { volunteeringQuery } from "@/lib/cms";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "./section-header";

export function Volunteering() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: volunteering = [] } = useQuery(volunteeringQuery);

  const selectedVol = volunteering.find((v) => v.id === selectedId);

  return (
    <section id="volunteering" className="py-28 sm:py-36 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="09"
          eyebrow="Giving Back"
          title={
            <>
              Volunteering &{" "}
              <span className="font-serif-italic text-[color:var(--neon)]">Contributions.</span>
            </>
          }
          subtitle="Building communities, mentoring, and contributing to open initiatives."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteering.map((vol, i) => (
            <motion.div
              key={vol.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setSelectedId(vol.id)}
              className="group relative p-8 hairline rounded-3xl bg-surface/40 hover:bg-surface/70 transition-colors cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-surface-2 hairline flex items-center justify-center font-display text-xl text-foreground/60 overflow-hidden group-hover:text-[color:var(--neon)] transition-colors">
                  {(vol as any).image ? (
                    <img src={(vol as any).image} alt={vol.organization} className="h-full w-full object-cover p-0.5" />
                  ) : (
                    vol.organization.charAt(0)
                  )}
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  {vol.period}
                </span>
              </div>
              <h3 className="font-display text-2xl tracking-tight mb-2 group-hover:text-[color:var(--amber)] transition-colors">
                {vol.organization}
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--neon)] mb-4">
                {vol.role}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{vol.description}</p>
              <div className="mt-auto pt-4 border-t hairline flex justify-between items-center">
                <span className="text-sm font-medium">Read impact</span>
                <span className="h-8 w-8 rounded-full hairline flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  +
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedId && selectedVol && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="bg-surface rounded-3xl hairline p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[color:var(--neon)]/20 rounded-full blur-3xl" />

                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 h-10 w-10 rounded-full hairline flex items-center justify-center hover:bg-surface-2 transition-colors z-10"
                >
                  ✕
                </button>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-surface-2 hairline flex items-center justify-center font-display text-3xl text-[color:var(--amber)]">
                      {selectedVol.organization.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display text-3xl tracking-tight">
                        {selectedVol.organization}
                      </h2>
                      <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--neon)] mt-1">
                        {selectedVol.role} · {selectedVol.period}
                      </p>
                    </div>
                  </div>

                  <p className="text-[15px] leading-relaxed text-foreground/90 mb-8">
                    {selectedVol.description}
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        Achievements
                      </h3>
                      <ul className="space-y-3">
                        {selectedVol.achievements.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] shrink-0" />
                            <span className="text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        Responsibilities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedVol.responsibilities.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full hairline text-xs text-foreground/70 bg-surface-2/30"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
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
