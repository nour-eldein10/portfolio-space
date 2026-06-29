import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { SiteNav } from "./nav";
import { ContactFooter } from "./contact-footer";

export interface DetailAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
}

export interface DetailStats {
  rating?: number;
  reviews?: string;
  downloads?: string;
  category?: string;
}

export interface RelatedItem {
  id: string;
  name: string;
  cover: string;
  type: string;
  rating?: number;
}

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const filled = Math.round(rating);
  const cls = size === "lg" ? "text-base" : size === "sm" ? "text-[10px]" : "text-xs";
  return (
    <span className={`${cls} text-[color:var(--amber)] inline-flex`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? "" : "opacity-25"}>★</span>
      ))}
    </span>
  );
}

function RatingBar({ pct, count }: { pct: number; count: number }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
      <span className="w-4 text-right">{count}</span>
      <span className="text-[10px]">★</span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-[color:var(--amber)]"
          style={{ width: `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

function MediaCarousel({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollTo(idx: number) {
    setActive(idx);
    const el = scrollRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  return (
    <div className="space-y-3">
      {/* Thumbnails row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide"
      >
        {items.map((url, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`View media ${i + 1}`}
            className={`snap-center shrink-0 relative rounded-2xl overflow-hidden hairline transition-all ${
              active === i ? "ring-2 ring-[color:var(--neon)]" : "opacity-70 hover:opacity-100"
            }`}
          >
            <MediaThumb url={url} />
          </button>
        ))}
      </div>

      {/* Active media fullscreen */}
      <div className="rounded-2xl overflow-hidden hairline bg-surface/30">
        <MediaFull url={items[active]} />
      </div>
    </div>
  );
}

function MediaThumb({ url }: { url: string }) {
  const isMp4 = url.toLowerCase().endsWith(".mp4");
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  if (isMp4 || isYoutube) {
    return (
      <div className="h-20 w-32 bg-surface-2 flex items-center justify-center rounded-2xl">
        <span className="text-2xl">▶</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt="Thumbnail"
      className="h-20 w-32 object-cover rounded-2xl"
    />
  );
}

function MediaFull({ url }: { url: string }) {
  const isMp4 = url.toLowerCase().endsWith(".mp4");
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  if (isYoutube) {
    let videoId = "";
    if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
    else if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
    return (
      <iframe
        className="w-full aspect-video"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isMp4) {
    return (
      <video
        src={url}
        controls
        className="w-full max-h-[520px] object-contain bg-black"
      />
    );
  }

  return (
    <img
      src={url}
      alt="Gallery"
      className="w-full max-h-[520px] object-contain"
    />
  );
}

export function DetailShell({
  eyebrow,
  title,
  meta,
  cover,
  coverStyle = "full",
  body,
  gallery = [],
  stats,
  actions = [],
  relatedItems = [],
  tags = [],
  children,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  cover?: string | null;
  coverStyle?: "icon" | "full";
  body?: string;
  gallery?: string[];
  stats?: DetailStats;
  actions?: DetailAction[];
  relatedItems?: RelatedItem[];
  tags?: string[];
  children?: React.ReactNode;
}) {
  // Fake review distribution for demonstration (can be extended via CMS later)
  const ratingVal = stats?.rating ?? 0;
  const bars: { count: number; pct: number }[] = [
    { count: 5, pct: ratingVal >= 4.5 ? 78 : ratingVal >= 4 ? 60 : 30 },
    { count: 4, pct: ratingVal >= 4 ? 14 : 25 },
    { count: 3, pct: 4 },
    { count: 2, pct: 2 },
    { count: 1, pct: 2 },
  ];

  return (
    <main className="relative bg-background min-h-screen">
      <SiteNav />

      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <Link
            to="/apps"
            className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-2"
          >
            <span>←</span> Back to Marketplace
          </Link>

          {/* ─── HERO HEADER ─── */}

          {/* Full-cover hero image */}
          {cover && coverStyle === "full" && (
            <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden hairline shadow-2xl shadow-black/30 bg-surface mb-10">
              <img src={cover} alt={title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,color-mix(in_oklab,var(--background)_70%,transparent)_100%)]" />
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Left: icon (app store style) */}
            {cover && coverStyle === "icon" && (
              <div className="shrink-0 h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] overflow-hidden hairline shadow-2xl shadow-black/30 bg-surface">
                <img src={cover} alt={title} className="h-full w-full object-cover" />
              </div>
            )}

            {/* Right: info */}
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">{title}</h1>
                <p className="mt-1 text-base font-medium text-[color:var(--neon)]">{eyebrow}</p>
                {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
              </div>

              {/* Stats row */}
              {ratingVal > 0 && (
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold">{ratingVal.toFixed(1)} ★</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">{stats?.reviews ?? "0"} reviews</span>
                  </div>
                  {stats?.downloads && (
                    <>
                      <div className="w-px h-8 bg-border" />
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold">{stats.downloads}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Downloads</span>
                      </div>
                    </>
                  )}
                  {stats?.category && (
                    <>
                      <div className="w-px h-8 bg-border" />
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold truncate max-w-[100px] text-center">{stats.category}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Category</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {actions.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-1">
                  {actions.map((action, i) =>
                    action.href ? (
                      <a
                        key={i}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-8 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                          action.variant === "secondary"
                            ? "bg-surface-2 text-foreground border border-border hover:bg-surface hover:border-foreground/30"
                            : "bg-[color:var(--neon)] text-black hover:opacity-90 shadow-[0_0_20px_color-mix(in_oklab,var(--neon)_40%,transparent)]"
                        }`}
                      >
                        {action.label}
                      </a>
                    ) : (
                      <button
                        key={i}
                        onClick={action.onClick}
                        className={`px-8 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                          action.variant === "secondary"
                            ? "bg-surface-2 text-foreground border border-border hover:bg-surface hover:border-foreground/30"
                            : "bg-[color:var(--neon)] text-black hover:opacity-90 shadow-[0_0_20px_color-mix(in_oklab,var(--neon)_40%,transparent)]"
                        }`}
                      >
                        {action.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── MEDIA CAROUSEL ─── */}
          {gallery.length > 0 && (
            <div className="mt-12">
              <MediaCarousel items={gallery} />
            </div>
          )}

          {/* ─── BODY + SIDEBAR ─── */}
          <div className="mt-12 flex flex-col lg:flex-row gap-10">
            {/* Main content column */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* About */}
              {body && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">About this {eyebrow.split("·")[0].trim()}</h2>
                    <span className="text-muted-foreground text-sm">→</span>
                  </div>
                  <div className="text-[15px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {body}
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tags.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full text-xs hairline bg-surface text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {children && <section>{children}</section>}

              {/* Divider */}
              <div className="w-full h-px bg-border/40" />

              {/* ─── RATINGS & REVIEWS ─── */}
              {ratingVal > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-6">Ratings &amp; Reviews</h2>
                  <div className="flex flex-col sm:flex-row gap-8">
                    {/* Big score */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-40">
                      <span className="font-display text-6xl font-bold">{ratingVal.toFixed(1)}</span>
                      <Stars rating={ratingVal} size="lg" />
                      <span className="text-xs text-muted-foreground mt-1">{stats?.reviews ?? "0"} ratings</span>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 flex flex-col-reverse gap-1.5 justify-center">
                      {bars.map((b) => (
                        <RatingBar key={b.count} count={b.count} pct={b.pct} />
                      ))}
                    </div>
                  </div>

                  {/* Placeholder review cards */}
                  <div className="mt-8 space-y-4">
                    {[
                      { author: "Ahmed K.", date: "Jun 2026", text: "Excellent work! Really clean and professional output.", rating: 5 },
                      { author: "Sara M.", date: "May 2026", text: "Loved the design. Would definitely recommend.", rating: 4 },
                    ].map((r) => (
                      <div key={r.author} className="p-5 rounded-2xl bg-surface/40 hairline space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-[13px] font-medium">
                              {r.author[0]}
                            </div>
                            <span className="text-sm font-medium">{r.author}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">{r.date}</span>
                        </div>
                        <Stars rating={r.rating} size="sm" />
                        <p className="text-[14px] text-foreground/75">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ─── SIDEBAR ─── */}
            {relatedItems.length > 0 && (
              <aside className="lg:w-72 shrink-0">
                <h2 className="text-lg font-semibold mb-4">Similar projects →</h2>
                <div className="space-y-3">
                  {relatedItems.slice(0, 6).map((item) => {
                    const to =
                      item.type === "Apps"
                        ? `/apps/${item.id}`
                        : item.type === "Graphic Design"
                        ? `/designs/${item.id}`
                        : `/projects/${item.id}`;
                    return (
                      <Link
                        key={item.id}
                        to={to as any}
                        className="flex items-center gap-3 p-3 rounded-2xl hairline bg-surface/20 hover:bg-surface/50 transition-colors group"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden hairline">
                          <img src={item.cover} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium line-clamp-1 group-hover:text-[color:var(--neon)] transition-colors">
                            {item.name}
                          </p>
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Stars rating={item.rating} size="sm" />
                              <span className="text-[11px] text-muted-foreground">{item.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-muted-foreground text-lg">›</span>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}
