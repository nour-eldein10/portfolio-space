import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { apps as appsFallback } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ProjectReviews } from "@/components/site/project-reviews";
import { appsQuery } from "@/lib/cms";
import { GalleryViewer } from "@/components/site/gallery-viewer";

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
    try {
      const doc = await sanityClient.fetch(`*[_type=="app" && slug.current==$slug][0]`, {
        slug: params.slug,
      });
      if (doc) return doc;
    } catch {
      // Sanity unreachable
    }
    const fallbackDoc = appsFallback.find((a) => a.id === params.slug);
    if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
    throw notFound();
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

function AppDetail() {
  const initial: any = Route.useLoaderData();
  const { data: a } = useQuery({
    queryKey: ["cms", "app", initial.slug?.current],
    queryFn: async () => {
      try {
        const doc = await sanityClient.fetch(`*[_type=="app" && slug.current==$slug][0]`, {
          slug: initial.slug?.current,
        });
        if (doc) return doc;
      } catch {
        // Sanity unreachable
      }
      const fallbackDoc = appsFallback.find((f) => f.id === initial.slug?.current);
      if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      return initial;
    },
    initialData: initial,
  });

  const { data: allApps } = useQuery(appsQuery);

  const coverUrl = a?.cover?.asset ? urlFor(a.cover).width(1600).url() : initial.cover;
  const iconUrl = a?.cover?.asset ? urlFor(a.cover).width(256).url() : initial.cover;
  const gallery: any[] = Array.isArray(a?.gallery) ? a.gallery : [];
  const features: string[] = Array.isArray(a?.features) ? a.features : [];
  const technologies: string[] = Array.isArray(a?.technologies) ? a.technologies : [];
  const currentId = a?.slug?.current ?? initial.id;
  const otherApps = (allApps ?? []).filter((x: any) => (x.id ?? x.slug?.current) !== currentId).slice(0, 6);

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
              &larr; Marketplace
            </Link>
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">{a.name}</h1>
            <p className="mt-0.5 text-sm text-[color:var(--neon)] font-medium">Nour Eldein</p>
            {a.tagline && <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-1">{a.tagline}</p>}
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {a.purchaseUrl ? (
              <a
                href={a.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all shadow-[0_0_16px_color-mix(in_oklab,var(--neon)_30%,transparent)]"
              >
                {a.price ? `Get \u2014 ${a.price}` : "Install"}
              </a>
            ) : (
              <button className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all shadow-[0_0_16px_color-mix(in_oklab,var(--neon)_30%,transparent)]">
                Install
              </button>
            )}
            {a.demoUrl && (
              <a
                href={a.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-surface-2 text-foreground border border-border hover:bg-surface hover:border-foreground/30 transition-all"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* BODY + SIDEBAR */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            {(a.description || a.tagline) && (
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground mb-3">About this app</h2>
                <p className="text-[13px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {a.description ?? a.tagline}
                </p>
              </section>
            )}

            {features.length > 0 && (
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground mb-3">Features</h2>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--neon)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {technologies.length > 0 && (
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground mb-3">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full hairline text-xs font-mono bg-surface/40">{t}</span>
                  ))}
                </div>
              </section>
            )}

            {/* SCREENSHOT GALLERY */}
            <GalleryViewer gallery={gallery} />
          </div>

          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0 space-y-4">
            <div className="p-4 rounded-2xl hairline bg-surface/30 space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">App Info</h3>
              {[
                { label: "Category", value: a.category || "\u2014" },
                ...(a.rating ? [{ label: "Rating", value: `${a.rating} \u2605 (${a.reviews || "\u2014"})` }] : []),
                ...(a.downloads ? [{ label: "Installs", value: a.downloads }] : []),
                ...(a.price ? [{ label: "Price", value: a.price }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-right max-w-[110px] truncate">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {a.purchaseUrl ? (
                <a
                  href={a.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all text-center"
                >
                  {a.price ? `Get \u2014 ${a.price}` : "Install Now"}
                </a>
              ) : (
                <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all">
                  Install Now
                </button>
              )}
              {a.demoUrl && (
                <a
                  href={a.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-surface-2 text-foreground border border-border hover:bg-surface transition-all text-center"
                >
                  Live Demo
                </a>
              )}
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
                View all &rarr;
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
                      <span className="text-[8px] text-[color:var(--amber)]">&#9733;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ProjectReviews projectId={currentId} />
      </div>
    </main>
  );
}
