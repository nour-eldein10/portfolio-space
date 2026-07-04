import { useState, useRef } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { designs } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { DesignMasonryGallery } from "@/components/site/design-masonry-gallery";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";
import { ChevronDown, Share2, ArrowLeft, ExternalLink } from "lucide-react";

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

const EASE = [0.16, 1, 0.3, 1] as const;

const revealUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

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

  const coverUrl = d?.cover?.asset ? urlFor(d.cover).width(2400).url() : initial.cover;
  const gallery: any[] = Array.isArray(d?.gallery) ? d.gallery : [];
  const tools: string[] = Array.isArray(d?.tools) ? d.tools : [];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.9]);
  const [copied, setCopied] = useState(false);

  const staticList = designs;
  const idx = staticList.findIndex((x) => x.id === (d?.slug?.current ?? initial.slug?.current));
  const prevDesign = idx > 0 ? staticList[idx - 1] : staticList[staticList.length - 1];
  const nextDesign = idx >= 0 && idx < staticList.length - 1 ? staticList[idx + 1] : staticList[0];
  const related = staticList
    .filter((x) => x.id !== (d?.slug?.current ?? initial.slug?.current) && x.category === d?.category)
    .slice(0, 3);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: d?.title, url });
      } catch { }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const overviewRows = [
    { label: "Category", value: d?.category },
    { label: "Client", value: d?.client },
    { label: "Year", value: d?.year ? String(d.year) : undefined },
    { label: "Role", value: d?.role },
  ].filter((r) => r.value);

  return (
    <main className="relative bg-background min-h-screen">
      <SiteNav />

      <div ref={heroRef} className="relative h-[90vh] min-h-[560px] overflow-hidden">
        {coverUrl ? (
          <motion.img
            src={coverUrl}
            alt={d?.title}
            style={{ y: heroImgY }}
            className="absolute inset-0 h-[120%] w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--neon)]/30 to-[color:var(--amber)]/20" />
        )}
        <motion.div
          style={{ opacity: heroOverlayOpacity }}
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.55)_55%,var(--background)_100%)]"
        />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-5xl px-5 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Link
                to="/"
                className="font-mono text-[10px] tracking-widest uppercase text-white/70 hover:text-white inline-flex items-center gap-1.5 mb-4"
              >
                <ArrowLeft className="size-3" /> Back to portfolio
              </Link>
              <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] text-white">
                {d?.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[color:var(--neon)] font-medium">
                by Nour Eldein
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-5">
                {d?.category && <Badge>{d.category}</Badge>}
                {d?.client && <Badge>{d.client}</Badge>}
                {d?.year && <Badge>{d.year}</Badge>}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown className="size-6" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-5xl px-5 pt-16 pb-24">
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } } as Variants}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-20"
        >
          {overviewRows.map((row) => (
            <motion.div
              key={row.label}
              variants={revealUp}
              className="p-4 rounded-2xl hairline bg-surface/40 backdrop-blur-sm"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                {row.label}
              </div>
              <div className="text-sm font-semibold truncate">{row.value}</div>
            </motion.div>
          ))}
          {tools.length > 0 && (
            <motion.div
              variants={revealUp}
              className="p-4 rounded-2xl hairline bg-surface/40 backdrop-blur-sm col-span-2 sm:col-span-3 lg:col-span-2"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Tools
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full hairline text-xs font-mono bg-surface/60">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
          {d?.projectUrl && (
            <motion.a
              variants={revealUp}
              href={d.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl hairline bg-[color:var(--neon)] text-black flex flex-col justify-between hover:opacity-90 transition-opacity"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest opacity-70 mb-1">
                Live project
              </div>
              <div className="text-sm font-semibold flex items-center gap-1">
                View project <ExternalLink className="size-3.5" />
              </div>
            </motion.a>
          )}
        </motion.section>

        <div className="space-y-16">
          {d?.description && (
            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: "-100px" }}
              variants={revealUp}
              className="max-w-[640px]"
            >
              <h2 className="font-display font-semibold text-2xl mb-4">About this design</h2>
              <p className="text-[15px] leading-[1.8] text-foreground/80 whitespace-pre-wrap">
                {d.description}
              </p>
            </motion.section>
          )}

          {d?.additionalText && (
            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, margin: "-100px" }}
              variants={revealUp}
              className="max-w-[640px]"
            >
              <p className="text-[15px] leading-[1.8] text-foreground/80 whitespace-pre-wrap">
                {d.additionalText}
              </p>
            </motion.section>
          )}

          <DesignMasonryGallery cover={coverUrl} gallery={gallery} />
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display font-semibold text-2xl mb-6">More designs</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} to="/designs/$slug" params={{ slug: r.id }} className="group">
                  <div className="rounded-2xl overflow-hidden hairline aspect-[4/3]">
                    <img
                      src={r.cover}
                      alt={r.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium">{r.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 flex items-center justify-between gap-4 border-t hairline pt-8">
          <Link
            to="/designs/$slug"
            params={{ slug: prevDesign.id }}
            className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← Previous
          </Link>
          <Link
            to="/designs/$slug"
            params={{ slug: nextDesign.id }}
            className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Next →
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 p-2 rounded-2xl hairline bg-surface/80 backdrop-blur-md shadow-xl">
        {d?.projectUrl && (
          <a
            href={d.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View project"
            className="size-11 rounded-xl flex items-center justify-center bg-[color:var(--neon)] text-black hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
        <button
          onClick={handleShare}
          title="Share"
          className="size-11 rounded-xl flex items-center justify-center hairline bg-background/60 hover:bg-surface transition-colors relative"
        >
          <Share2 className="size-4" />
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-full mr-2 whitespace-nowrap text-[10px] font-mono bg-foreground text-background px-2 py-1 rounded"
              >
                Link copied
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <Link
          to="/"
          title="Back to portfolio"
          className="size-11 rounded-xl flex items-center justify-center hairline bg-background/60 hover:bg-surface transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <ContactFooter />
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full hairline bg-white/10 backdrop-blur-sm text-white text-xs font-medium">
      {children}
    </span>
  );
}