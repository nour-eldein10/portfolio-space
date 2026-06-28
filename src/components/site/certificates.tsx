import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { certificates } from "@/lib/portfolio-data";
import { SectionHeader } from "./section-header";
import useEmblaCarousel from "embla-carousel-react";

export function Certificates() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="certificates" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeader
            index="08"
            eyebrow="Continuous Learning"
            title={
              <>
                Certificates &{" "}
                <span className="font-serif-italic text-[color:var(--amber)]">Awards.</span>
              </>
            }
          />
          <div className="flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="h-10 w-10 rounded-full hairline flex items-center justify-center hover:bg-surface hover:text-[color:var(--neon)] transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="h-10 w-10 rounded-full hairline flex items-center justify-center hover:bg-surface hover:text-[color:var(--neon)] transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-6">
              {certificates.map((cert, i) => (
                <div
                  key={cert.id}
                  className="pl-6 min-w-0 flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_40%] lg:flex-[0_0_30%]"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateY: 8 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative flex flex-col hairline rounded-3xl bg-surface/40 overflow-hidden hover:bg-surface/70 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.08)] transition-colors duration-500 h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-2 p-2">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--neon)]/10 to-transparent mix-blend-overlay z-10" />
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                          {cert.date}
                        </span>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[color:var(--neon)] bg-[color:var(--neon)]/10 px-2 py-0.5 rounded hairline">
                          Verified
                        </span>
                      </div>
                      <h3 className="font-display text-xl tracking-tight mb-2 group-hover:text-[color:var(--amber)] transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">{cert.issuer}</p>
                      <div className="mt-auto pt-4 border-t hairline">
                        <button className="text-sm font-medium flex items-center gap-2 group/btn">
                          View Details
                          <span className="text-[color:var(--neon)] group-hover/btn:translate-x-1 transition-transform">
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
