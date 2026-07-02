import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { featuredProducts } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { Reviews } from "@/components/site/reviews";

export const Route = createFileRoute("/products/$slug")({
  head: ({ loaderData }) => {
    const p: any = loaderData;
    const title = p?.name ? `${p.name} — Product` : "Product — Nour Eldein";
    const desc = p?.summary ?? p?.description ?? "A product from Nour Eldein's portfolio.";
    const og = p?.cover?.asset ? urlFor(p.cover).width(1200).height(630).url() : undefined;
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
    const doc = await sanityClient.fetch(`*[_type=="product" && slug.current==$slug][0]`, {
      slug: params.slug,
    });
    if (!doc) {
      const fallbackDoc = featuredProducts.find((p) => p.id === params.slug);
      if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      throw notFound();
    }
    return doc;
  },
  errorComponent: () => <DetailShell eyebrow="Error" title="Could not load this product" />,
  notFoundComponent: () => (
    <DetailShell eyebrow="404" title="Product not found">
      <Link to="/" className="text-sm underline">
        Back home
      </Link>
    </DetailShell>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const initial: any = Route.useLoaderData();
  const { data: p } = useQuery({
    queryKey: ["cms", "product", initial.slug?.current],
    queryFn: async () => {
      const doc = await sanityClient.fetch(`*[_type=="product" && slug.current==$slug][0]`, {
        slug: initial.slug?.current,
      });
      if (!doc) {
        const fallbackDoc = featuredProducts.find((f) => f.id === initial.slug?.current);
        if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      }
      return doc;
    },
    initialData: initial,
  });

  const cover = p?.cover?.asset ? urlFor(p.cover).width(1600).url() : p?.cover;
  const meta = [p.year, p.role].filter(Boolean).join(" · ");
  const features: string[] = p?.features ?? [];
  const technologies: string[] = p?.technologies ?? [];

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="pt-32 pb-24 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left Column: Product Info */}
          <div className="flex flex-col items-start gap-8">
            <Link to="/" className="font-mono text-[10px] tracking-widest uppercase text-[color:var(--neon)] hover:opacity-80 inline-flex items-center gap-2">
              ← Back to portfolio
            </Link>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase text-muted-foreground bg-surface/50 px-4 py-2 rounded-full hairline">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] animate-pulse" />
                {meta}
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tight text-foreground">
                {p.name}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed pt-2">
                {p.description ?? p.summary}
              </p>
            </div>

            {/* Stats row */}
            {(p.rating || p.downloads || p.price) && (
              <div className="grid grid-cols-3 gap-6 w-full py-8 border-y hairline border-border/40">
                {p.rating && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Rating</span>
                    <span className="font-display text-2xl text-foreground flex items-center gap-1">
                      {p.rating} <span className="text-amber-400">★</span>
                      {p.reviews && <span className="text-sm text-muted-foreground font-sans">({p.reviews})</span>}
                    </span>
                  </div>
                )}
                {p.downloads && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Installs</span>
                    <span className="font-display text-2xl text-foreground">{p.downloads}</span>
                  </div>
                )}
                {p.price && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Price</span>
                    <span className="font-display text-2xl text-foreground">{p.price}</span>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="w-full space-y-3">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Features</h2>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--neon)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="w-full space-y-3">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full hairline text-xs font-mono bg-surface/40">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              {p.purchaseUrl ? (
                <a
                  href={p.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-medium bg-foreground text-background hover:bg-[color:var(--neon)] hover:text-background transition-all duration-300 text-center"
                >
                  Get this Product{p.price ? ` — ${p.price}` : ""}
                </a>
              ) : (
                <button className="w-full sm:w-auto px-8 py-4 rounded-full font-medium bg-foreground text-background opacity-50 cursor-not-allowed">
                  Get this Product
                </button>
              )}
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-medium border hairline hover:bg-surface transition-colors text-center"
                >
                  View Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative w-full aspect-[4/5] rounded-[2rem] hairline p-2 bg-surface/30 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--neon)]/10 to-[color:var(--amber)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {cover && (
              <img
                src={cover}
                alt={p.name}
                className="w-full h-full object-cover rounded-[1.5rem] shadow-2xl group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            )}
          </div>
        </div>
      </div>
      <Reviews />
    </main>
  );
}
