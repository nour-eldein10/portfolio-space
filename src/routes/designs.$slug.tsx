import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { designs } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { DesignMasonryGallery } from "@/components/site/design-masonry-gallery";
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

  const cover = d?.cover?.asset ? urlFor(d.cover).width(2000).url() : d?.cover;
  const gallery = Array.isArray(d?.gallery) ? d.gallery : [];

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero area */}
      <div className="pt-24 pb-12 mx-auto max-w-7xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-10 md:items-end justify-between mb-10"
        >
          <div className="max-w-2xl">
            <Link
              to="/"
              className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-5 transition-colors"
            >
              ← Back to portfolio
            </Link>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold mb-4 leading-[1.1]">
              {d.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {d.category && (
                <span className="px-3 py-1 rounded-full hairline bg-surface/60 text-foreground text-sm font-medium">
                  {d.category}
                </span>
              )}
              {d.description && (
                <span className="text-sm text-muted-foreground line-clamp-2 max-w-lg">
                  {d.description}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 flex gap-3">
            <button className="px-5 py-2.5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-[color:var(--amber)] transition-colors">
              Appreciate ♥
            </button>
          </div>
        </motion.div>

        {/* Behance-style masonry gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <DesignMasonryGallery cover={cover} gallery={gallery} />
        </motion.div>
      </div>

      <ContactFooter />
    </main>
  );
}


