import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { apps } from "@/lib/portfolio-data";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { Button } from "@/components/ui/button";

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
      const fallbackDoc = apps.find((a) => a.id === params.slug);
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
        <h1 className="text-4xl font-display mb-4">App not found</h1>
        <Link to="/apps" className="underline">Back to marketplace</Link>
      </div>
    </main>
  ),
  component: AppDetail,
});

import { DetailShell } from "@/components/site/detail-shell";

function AppDetail() {
  const initial: any = Route.useLoaderData();
  const { data: a } = useQuery({
    queryKey: ["cms", "app", initial.slug?.current],
    queryFn: async () => {
      const doc = await sanityClient.fetch(`*[_type=="app" && slug.current==$slug][0]`, {
        slug: initial.slug?.current,
      });
      if (!doc) {
        const fallbackDoc = apps.find((f) => f.id === initial.slug?.current);
        if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      }
      return doc;
    },
    initialData: initial,
  });

  const coverUrl = a?.cover?.asset ? urlFor(a.cover).width(512).url() : initial.cover;
  const gallery = Array.isArray(a.gallery) ? a.gallery : [];

  return (
    <DetailShell
      title={a.name}
      eyebrow="Nour Eldein"
      meta={a.tagline}
      cover={coverUrl}
      body={a.description ?? a.tagline}
      gallery={gallery}
      stats={{
        rating: a.rating,
        reviews: a.reviews,
        downloads: a.downloads,
        category: a.category,
      }}
      actions={[
        { label: "Install", variant: "primary" },
        { label: "Order your product", variant: "secondary" }
      ]}
    />
  );
}
