import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { designs } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { GalleryViewer } from "@/components/site/gallery-viewer";
import { CollapsibleSection } from "@/components/site/collapsible-section";
import { motion } from "motion/react";

export const Route = createFileRoute("/designs/$slug")({
  head: ({ loaderData }) => {
    const d: any = loaderData;
    const title = d?.title ? `${d.title} — Design` : "Design — Nour Eldein";
    const desc = d?.description ?? d?.category ?? "A design from Nour Eldein's portfolio.";
    const og = d?.cover?.asset ? urlFor(d.cover).width(1200).height(630).url() : undefined;
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
    const doc = await sanityClient.fetch(`*[_type=="design" && slug.current==$slug][0]`, {
      slug: params.slug,
    });
    if (!doc) {
      const fallbackDoc = designs.find((d) => d.id === params.slug);
      if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      throw notFound();
    }
    return doc;
  },
  errorComponent: () => <DetailShell eyebrow="Error" title="Could not load this design" />,
  notFoundComponent: () => (
    <DetailShell eyebrow="404" title="Design not found">
      <Link to="/" className="text-sm underline">
        Back home
      </Link>
    </DetailShell>
  ),
  component: DesignDetail,
});

function DesignDetail() {
  const initial: any = Route.useLoaderData();
  const { data: d } = useQuery({
    queryKey: ["cms", "design", initial.slug?.current],
    queryFn: async () => {
      const doc = await sanityClient.fetch(`*[_type=="design" && slug.current==$slug][0]`, {
        slug: initial.slug?.current,
      });
      if (!doc) {
        const fallbackDoc = designs.find((f) => f.id === initial.slug?.current);
        if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      }
      return doc;
    },
    initialData: initial,
  });

  const coverUrl = d?.cover?.asset ? urlFor(d.cover).width(1600).url() : initial.cover;
  const gallery: any[] = Array.isArray(d?.gallery) ? d.gallery : [];
  const tools: string[] = Array.isArray(d?.tools) ? d.tools : [];

  return (
    <main className="relative bg-background min-h-screen">
      <SiteNav />

      {/* HERO BANNER */}
      <div className="relative h-[40vh] min-h-[240px] max-h-[400px] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={d.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--neon)]/30 to-[color:var(--amber)]/20" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,color-mix(in_oklab,var(--background)_92%,transparent)_100%)]" />
      </div>

      <div className="relative -mt-16 mx-auto max-w-5xl px-5 pb-24">
        {/* IDENTITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-5 items-start sm:items-end"
        >
          <div className="flex-1 min-w-0 pb-1">
            <Link
              to="/"
              className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-1.5"
            >
              &larr; Back to portfolio
            </Link>
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">
              {d.title}
            </h1>
            <p className="mt-0.5 text-sm text-[color:var(--neon)] font-medium">Nour Eldein</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {d.category && (
                <span className="px-3 py-1 rounded-full hairline bg-surface/60 text-foreground text-xs font-medium">
                  {d.category}
                </span>
              )}
              {d.client && (
                <span className="px-3 py-1 rounded-full hairline bg-surface/60 text-foreground text-xs font-medium">
                  {d.client}
                </span>
              )}
              {d.year && (
                <span className="px-3 py-1 rounded-full hairline bg-surface/60 text-foreground text-xs font-medium">
                  {d.year}
                </span>
              )}
            </div>
          </div>

          {d.projectUrl && (
            <div className="shrink-0 flex gap-3">
              <a
                href={d.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-[color:var(--amber)] transition-colors"
              >
                View project ↗
              </a>
            </div>
          )}
        </motion.div>

        {/* BODY + SIDEBAR */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            {d.description && (
              <CollapsibleSection title="About this design">
                <p className="text-[13px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {d.description}
                </p>
              </CollapsibleSection>
            )}

            {tools.length > 0 && (
              <CollapsibleSection title="Tools used" defaultOpen={false}>
                <div className="flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full hairline text-xs font-mono bg-surface/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GalleryViewer gallery={gallery} isMobileMockup={false} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0 space-y-4">
            <div className="p-4 rounded-2xl hairline bg-surface/30 space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Project Info
              </h3>
              {[
                { label: "Category", value: d.category || "\u2014" },
                ...(d.client ? [{ label: "Client", value: d.client }] : []),
                ...(d.year ? [{ label: "Year", value: String(d.year) }] : []),
                ...(tools.length ? [{ label: "Tools", value: `${tools.length}` }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-right max-w-[110px] truncate">{row.value}</span>
                </div>
              ))}
            </div>
            {d.projectUrl && (
              <a
                href={d.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[color:var(--neon)] text-black hover:opacity-90 transition-all text-center block"
              >
                View project ↗
              </a>
            )}
          </aside>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}