import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsQuery, liveStatsQuery } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./section-header";
import { ReviewForm } from "./review-form";
import useEmblaCarousel from "embla-carousel-react";

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{count}</>;
}

export function Reviews() {
  const { data: reviews } = useQuery(reviewsQuery);
  const { data: stats } = useQuery(liveStatsQuery);
  const qc = useQueryClient();

  // For the reviews carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const ch = supabase
      .channel("public-reviews")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        qc.invalidateQueries({ queryKey: ["public", "reviews"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  return (
    <section id="reviews" className="relative py-28 sm:py-36 bg-surface/30 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[color:var(--neon)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-[color:var(--amber)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="07"
          eyebrow="Trust & numbers"
          title={
            <>
              Driven by <span className="font-serif-italic text-[color:var(--neon)]">results</span>{" "}
              & feedback.
            </>
          }
          subtitle="Real numbers from live products and the people I've built them with."
        />

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 hairline rounded-3xl overflow-hidden bg-surface/20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-7 sm:p-10 ${
                i < stats.length - 1 ? "md:border-r" : ""
              } ${i < 2 ? "border-b md:border-b-0" : ""} hairline group`}
            >
              <div className="font-display text-4xl sm:text-5xl tracking-[-0.03em] group-hover:text-[color:var(--amber)] transition-colors duration-500">
                {typeof s.value === "number" ? <AnimatedCounter value={s.value} /> : s.value}
                {s.label === "Average Rating" && (
                  <span className="text-2xl ml-1 text-[color:var(--amber)]">★</span>
                )}
              </div>
              <div className="mt-2 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reviews Carousel */}
        <div className="mt-24 relative">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-6">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="pl-6 min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <motion.blockquote
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="group relative p-8 rounded-3xl bg-background/50 backdrop-blur-xl border border-white/5 dark:border-white/5 shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white/10 transition-all duration-500 h-full flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative z-10">
                      <span className="font-serif-italic text-6xl text-[color:var(--amber)]/30 leading-none absolute -top-2 -left-2 transition-transform duration-500 group-hover:scale-110">
                        "
                      </span>
                      <p className="text-[15px] leading-relaxed text-foreground/90 mt-8 font-medium">
                        {r.quote}
                      </p>
                    </div>
                    <footer className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-semibold tracking-tight">{r.author}</p>
                        <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-1">
                          {r.role}
                        </p>
                      </div>
                      {(r as any).avatar ? (
                        <img
                          src={(r as any).avatar}
                          alt={r.author}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-background shadow-md transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center font-display text-xs font-semibold text-muted-foreground ring-2 ring-background shadow-md transition-transform duration-500 group-hover:scale-110">
                          {r.author?.charAt(0) || "U"}
                        </div>
                      )}
                    </footer>
                  </motion.blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? "w-6 bg-[color:var(--neon)]"
                      : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
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
        </div>

        <ReviewForm />
      </div>
    </section>
  );
}
