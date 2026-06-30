import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { designs } from "@/lib/portfolio-data";

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

import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";

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
  
  // Combine cover and gallery to show all images
  const allImages = [cover, ...gallery].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <SiteNav />
      
      <div className="pt-24 pb-20 mx-auto max-w-7xl px-5">
        <div className="flex flex-col md:flex-row gap-10 md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <Link to="/" className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-4">
              ← Back to portfolio
            </Link>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold mb-4">
              {d.title}
            </h1>
            {(d.description || d.category) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {d.category && (
                  <span className="px-3 py-1 rounded-full hairline bg-surface/50 text-foreground font-medium">
                    {d.category}
                  </span>
                )}
                {d.description && <span className="line-clamp-2">{d.description}</span>}
              </div>
            )}
          </div>
          
          <div className="shrink-0 flex gap-3">
            <button className="px-5 py-2.5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
              Appreciate
            </button>
          </div>
        </div>

        {/* BEHANCE STYLE VERTICAL GALLERY */}
        <div className="w-full flex flex-col items-center gap-4 bg-[#111] p-2 md:p-4 rounded-3xl hairline">
          {allImages.map((imgUrl, i) => (
            <div key={i} className="w-full">
              {typeof imgUrl === "string" && imgUrl.toLowerCase().endsWith(".mp4") ? (
                <video src={imgUrl} autoPlay loop muted playsInline className="w-full h-auto object-cover rounded-xl" />
              ) : (
                <img src={imgUrl as string} alt={`Design preview ${i + 1}`} className="w-full h-auto object-cover rounded-xl" />
              )}
            </div>
          ))}
          {allImages.length === 0 && (
            <div className="py-32 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">
              No images available
            </div>
          )}
        </div>
      </div>
      
      <ContactFooter />
    </main>
  );
}
