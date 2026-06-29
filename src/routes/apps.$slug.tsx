import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { sanityClient, urlFor } from "@/lib/sanity";
import { apps as appsFallback } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { appsQuery } from "@/lib/cms";

export const Route = createFileRoute("/apps/$slug")({
  head: ({ loaderData }) => {
    const a: any = loaderData;
    const title = a?.name ? `${a.name} — App by Nour` : "App — Nour Eldein";
    const desc = a?.tagline ?? a?.description ?? "An app from Nour Eldein's portfolio.";
    const og = a?.cover?.asset ? urlFor(a.cover).width(1200).height(630).url() : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(og
          ? [
              { property: "og:image", content: og },
              { name: "twitter:image", content: og },
            ]
          : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const doc = await sanityClient.fetch(`*[_type=="app" && slug.current==$slug][0]`, {
      slug: params.slug,
    });
    if (!doc) {
      const fallbackDoc = appsFallback.find((a) => a.id === params.slug);
      if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      throw notFound();
    }
    return doc;
  },
  errorComponent: () => (
    <main>
      <SiteNav />
      <div className="py-40 text-center">Could not load this app</div>
    </main>
  ),
  notFoundComponent: () => (
    <main>
      <SiteNav />
      <div className="py-40 text-center">
        <h1 className="text-3xl font-display mb-4">App not found</h1>
        <Link to="/apps" className="underline text-sm">Back to marketplace</Link>
      </div>
    </main>
  ),
  component: AppDetail,
});

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const filled = Math.round(rating);
  const cls = size === "lg" ? "text-base" : size === "sm" ? "text-[10px]" : "text-xs";
  return (
    <span className={`${cls} text-[color:var(--amber)] inline-flex gap-px`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? "" : "opacity-25"}>★</span>
      ))}
    </span>
  );
}

function RatingBar({ count, pct }: { count: number; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="w-3 text-right">{count}</span>
      <span className="text-[9px]">★</span>
      <div className="flex-1 h-1 rounded-full bg-surface-2 overflow-hidden">
        <div className="h-full rounded-full bg-[color:var(--amber)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AppDetail() {
  const initial: any = Route.useLoaderData();
  const { data: a } = useQuery({
    queryKey: ["cms", "app", initial.slug?.current],
    queryFn: async () => {
      const doc = await sanityClient.fetch(`*[_type=="app" && slug.current==$slug][0]`, {
        slug: initial.slug?.current,
      });
      if (!doc) {
        const fallbackDoc = appsFallback.find((f) => f.id === initial.slug?.current);
        if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      }
      return doc;
    },
    initialData: initial,
  });

  const { data: allApps } = useQuery(appsQuery);

  const coverUrl = a?.cover?.asset ? urlFor(a.cover).width(1600).url() : initial.cover;
  const iconUrl = a?.cover?.asset ? urlFor(a.cover).width(256).url() : initial.cover;
  const gallery: string[] = Array.isArray(a?.gallery) ? a.gallery : [];
  const currentId = a?.slug?.current ?? initial.id;
  const ratingVal = a?.rating ?? 4.8;
  const otherApps = (allApps ?? []).filter((x) => x.id !== currentId).slice(0, 6);

  const bars = [
    { count: 5, pct: ratingVal >= 4.5 ? 78 : ratingVal >= 4 ? 60 : 30 },
    { count: 4, pct: ratingVal >= 4 ? 14 : 25 },
    { count: 3, pct: 4 },
    { count: 2, pct: 2 },
    { count: 1, pct: 2 },
  ];

  const [activeShot, setActiveShot] = useState(0);

  return (
    <main className="relative bg-background min-h-screen">
      <SiteNav />

      {/* HERO BANNER */}
      <div className="relative h-[40vh] min-h-[240px] max-h-[400px] overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={a.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--neon)]/30 to-[color:var(--amber)]/20" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,color-mix(in_oklab,var(--background)_92%,transparent)_100%)]" />
      </div>

      <div className="relative -mt-16 mx-auto max-w-5xl px-5 pb-24">

        {/* APP IDENTITY */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
          <div className="shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-[1.6rem] overflow-hidden hairline shadow-2xl shadow-black/40 bg-surface ring-4 ring-background">
            {iconUrl && <img src={iconUrl} alt={a.name} className="h-full w-full object-cover" />}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <Link to="/apps" className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-1.5">
              ← Marketplace
            </Link>
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">{a.name}</h1>
            <p className="mt-0.5 text-sm text-[color:var(--neon)] font-medium">Nour Eldein</p>
            {a.tagline && <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-1">{a.tagline}</p>}
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all shadow-[0_0_16px_color-mix(in_oklab,var(--neon)_30%,transparent)]">
              Install
            </button>
            <button className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-surface-2 text-foreground border border-border hover:bg-surface hover:border-foreground/30 transition-all">
              Order your product
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="mt-5 flex flex-wrap gap-px hairline rounded-2xl overflow-hidden bg-surface/20">
          {[
            { label: "Rating", value: `${ratingVal.toFixed(1)} ★` },
            { label: "Reviews", value: a.reviews ?? "0" },
            { label: "Downloads", value: a.downloads ?? "—" },
            { label: "Category", value: a.category ?? "App" },
          ].map((s) => (
            <div key={s.label} className="flex-1 min-w-[80px] flex flex-col items-center py-3 px-3 bg-surface/40">
              <span className="text-sm font-semibold font-display">{s.value}</span>
              <span className="text-[9px] text-muted-foreground mt-0.5 font-mono uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        {/* SCREENSHOT GALLERY */}
        {gallery.length > 0 && (
          <div className="mt-7 space-y-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground">Screenshots</h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeShot}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="relative w-full aspect-video rounded-2xl overflow-hidden hairline bg-surface/30"
              >
                {gallery[activeShot]?.toLowerCase().endsWith(".mp4") ? (
                  <video src={gallery[activeShot]} controls className="w-full h-full object-contain bg-black" />
                ) : (
                  <img src={gallery[activeShot]} alt={`Screenshot ${activeShot + 1}`} className="w-full h-full object-cover" />
                )}
              </motion.div>
            </AnimatePresence>

            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
                {gallery.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveShot(i)}
                    className={`snap-center shrink-0 relative rounded-xl overflow-hidden hairline transition-all ${
                      i === activeShot ? "ring-2 ring-[color:var(--neon)] opacity-100" : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={url} alt={`Thumb ${i + 1}`} className="h-14 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BODY + SIDEBAR */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">

            {(a.description || a.tagline) && (
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground mb-3">About this app</h2>
                <p className="text-[13px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {a.description ?? a.tagline}
                </p>
                {a.category && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] hairline bg-surface text-muted-foreground">{a.category}</span>
                  </div>
                )}
              </section>
            )}

            <div className="w-full h-px bg-border/40" />

            {ratingVal > 0 && (
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground mb-4">Ratings &amp; Reviews</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center justify-center shrink-0 w-32">
                    <span className="font-display text-5xl font-bold">{ratingVal.toFixed(1)}</span>
                    <Stars rating={ratingVal} size="lg" />
                    <span className="text-[10px] text-muted-foreground mt-1">{a.reviews ?? "0"} ratings</span>
                  </div>
                  <div className="flex-1 flex flex-col-reverse gap-1 justify-center">
                    {bars.map((b) => <RatingBar key={b.count} count={b.count} pct={b.pct} />)}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { author: "Ahmed K.", date: "Jun 2026", text: "Excellent work! Really clean and professional.", rating: 5 },
                    { author: "Sara M.", date: "May 2026", text: "Loved the design. Would definitely recommend.", rating: 4 },
                  ].map((r) => (
                    <div key={r.author} className="p-4 rounded-2xl bg-surface/40 hairline space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-[12px] font-medium">
                            {r.author[0]}
                          </div>
                          <span className="text-[13px] font-medium">{r.author}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{r.date}</span>
                      </div>
                      <Stars rating={r.rating} size="sm" />
                      <p className="text-[12px] text-foreground/75">{r.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0 space-y-4">
            <div className="p-4 rounded-2xl hairline bg-surface/30 space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">App Info</h3>
              {[
                { label: "Developer", value: "Nour Eldein" },
                { label: "Category", value: a.category ?? "—" },
                { label: "Downloads", value: a.downloads ?? "—" },
                { label: "Rating", value: `${ratingVal.toFixed(1)} / 5` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-right max-w-[110px] truncate">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all">
                Install Now
              </button>
              <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-surface-2 text-foreground border border-border hover:bg-surface transition-all">
                Order your product
              </button>
            </div>
          </aside>
        </div>

        {/* MORE APPS */}
        {otherApps.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display text-base font-medium tracking-tight">More Apps</h2>
              <div className="flex-1 h-px bg-border/50" />
              <Link to="/apps" className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {otherApps.map((app) => (
                <Link key={app.id} to="/apps/$slug" params={{ slug: app.id }} className="group flex flex-col gap-2">
                  <div className="relative aspect-square w-full overflow-hidden rounded-[1.4rem] hairline shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 bg-surface">
                    <img src={app.cover} alt={app.name} loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded-full">View</span>
                    </div>
                  </div>
                  <div className="px-0.5">
                    <p className="text-[11px] font-medium line-clamp-1 group-hover:text-[color:var(--neon)] transition-colors">{app.name}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{app.rating?.toFixed(1) ?? "5.0"}</span>
                      <span className="text-[8px] text-[color:var(--amber)]">★</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <ContactFooter />
    </main>
  );
}
