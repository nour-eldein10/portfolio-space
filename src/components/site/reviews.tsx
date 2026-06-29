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
    <section id="reviews" className="py-28 sm:py-36 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
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
            <div className="flex -ml-5">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="pl-5 min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <motion.blockquote
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="relative p-8 rounded-3xl hairline bg-background h-full flex flex-col justify-between hover:border-[color:var(--neon)]/30 transition-colors"
                  >
                    <div>
                      <span className="font-serif-italic text-5xl text-[color:var(--amber)] leading-none absolute top-4 left-6 opacity-30">
                        "
                      </span>
                      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4 relative z-10">
                        {r.quote}
                      </p>
                    </div>
                    <footer className="mt-8 pt-5 border-t hairline flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{r.author}</p>
                        <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mt-1">
                          {r.role}
                        </p>
                      </div>
                      {(r as any).avatar ? (
                        <img
                          src={(r as any).avatar}
                          alt={r.author}
                          className="h-8 w-8 rounded-full object-cover hairline"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center font-display text-xs text-muted-foreground hairline">
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
