import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { designs } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { GalleryViewer } from "@/components/site/gallery-viewer";
import { motion } from "motion/react";
import { Share2, ArrowLeft, ExternalLink, ChevronDown } from "lucide-react";

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

  /*
   * ─── COVER IMAGE URL ───────────────────────────────────────────────────
   * Adjust .width(N) to change the resolution of the hero image.
   * Higher = sharper but slower. 2400 is good for full-width heroes.
   */
  const coverUrl = d?.cover?.asset ? urlFor(d.cover).width(2400).url() : initial.cover;
  const gallery: any[] = Array.isArray(d?.gallery) ? d.gallery : [];
  const tools: string[] = Array.isArray(d?.tools) ? d.tools : [];

  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="relative bg-background min-h-screen overflow-x-hidden">
      <SiteNav />

      {/* ──────────────────────────────────────────────────────────────────
          HERO SECTION
          ── HOW TO ADJUST ─────────────────────────────────────────────────
          Hero height:  Change min-h-[75vh] below. E.g. min-h-[60vh] = shorter.
          Gradient:     Change the from-black/X values in the overlay div.
          Title size:   Change text-5xl/text-7xl in the h1 below.
      ────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[75vh] flex items-end overflow-hidden">
        {/* Background layer — blurred version of cover for non-cropped display */}
        {coverUrl && (
          <div
            className="absolute inset-0 scale-110"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(40px) brightness(0.4) saturate(1.2)",
            }}
          />
        )}

        {/* Actual cover image — contained, not cropped */}
        <div className="absolute inset-0 flex items-center justify-center">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={d?.title ?? "Project cover"}
              /*
               * IMAGE FIT in hero:
               *   object-contain → full image visible, no crop (default)
               *   object-cover   → fills frame, may crop edges
               * Max dimensions below (max-w-5xl max-h-[70vh]) prevent
               * the image from being too large. Adjust freely.
               */
              className="max-w-5xl max-h-[70vh] w-full object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--neon)]/30 to-[color:var(--amber)]/20" />
          )}
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Portfolio
            </Link>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap gap-2 mb-5"
            >
              {d?.category && (
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                  {d.category}
                </span>
              )}
              {d?.client && (
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[color:var(--neon)]/20 text-[color:var(--neon)] backdrop-blur-sm border border-[color:var(--neon)]/20">
                  {d.client}
                </span>
              )}
              {d?.year && (
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                  {d.year}
                </span>
              )}
            </motion.div>

            {/*
              TITLE SIZE: Change text-4xl sm:text-5xl lg:text-7xl below.
              e.g. text-5xl lg:text-8xl for bigger, text-3xl lg:text-5xl for smaller.
            */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.05] text-white mb-3"
            >
              {d?.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/50 font-mono text-sm tracking-wider"
            >
              by <span className="text-[color:var(--neon)]">Nour Eldein</span>
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 z-10"
          aria-hidden="true"
        >
          <span className="text-[9px] font-mono uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          BODY
      ────────────────────────────────────────────────────────────────── */}
      <div className="relative max-w-6xl mx-auto px-6 pb-32">
        {/* ── OVERVIEW CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Category", value: d?.category },
            { label: "Client", value: d?.client },
            { label: "Year", value: d?.year ? String(d.year) : undefined },
            { label: "Tools", value: tools.length > 0 ? tools.slice(0, 3).join(", ") : undefined },
          ]
            .filter((r) => r.value)
            .map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-5 rounded-2xl hairline bg-surface/50 backdrop-blur-sm space-y-1.5"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {row.label}
                </p>
                <p className="font-display font-semibold text-sm text-foreground leading-snug">
                  {row.value}
                </p>
              </motion.div>
            ))}

          {d?.projectUrl && (
            <motion.a
              href={d.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="p-5 rounded-2xl bg-[color:var(--neon)] text-black space-y-1.5 group hover:opacity-90 transition-all"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                Live project
              </p>
              <p className="font-display font-semibold text-sm flex items-center gap-1.5">
                View ↗
              </p>
            </motion.a>
          )}
        </motion.div>

        {/* ── DESCRIPTION ── */}
        {d?.description && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 max-w-3xl"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              About this project
            </p>
            {/*
              DESCRIPTION TEXT SIZE: Change text-lg below.
              e.g. text-xl for bigger, text-base for smaller.
              LINE HEIGHT: Change leading-relaxed (1.625) to leading-loose (2) etc.
            */}
            <p className="text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {d.description}
            </p>
          </motion.div>
        )}

        {/* ── TOOLS TAGS ── */}
        {tools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Tools used
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-xl hairline text-sm font-mono bg-surface/50 text-foreground/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── GALLERY ── */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-20"
          >
            <GalleryViewer gallery={gallery} isMobileMockup={false} />
          </motion.div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          STICKY FLOATING ACTIONS (desktop only)
          ── HOW TO ADJUST ─────────────────────────────────────────────────
          Position: Change right-6 bottom-8 below to move the panel.
          Show/hide on mobile: it's hidden on mobile via hidden lg:flex.
      ────────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed right-6 bottom-8 z-50 hidden lg:flex flex-col gap-3"
        aria-label="Quick actions"
      >
        {d?.projectUrl && (
          <a
            href={d.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View live project"
            title="View live project"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--neon)] text-black text-sm font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            View Project
          </a>
        )}
        <button
          onClick={handleShare}
          aria-label="Copy link to share"
          title="Copy link to share"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface hairline text-sm font-medium shadow-lg hover:bg-surface/80 transition-all"
        >
          <Share2 className="w-4 h-4" />
          {copied ? "Copied!" : "Share"}
        </button>
        <Link
          to="/"
          aria-label="Back to portfolio"
          title="Back to portfolio"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface hairline text-sm font-medium shadow-lg hover:bg-surface/80 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Portfolio
        </Link>
      </motion.div>

      <ContactFooter />
    </main>
  );
}