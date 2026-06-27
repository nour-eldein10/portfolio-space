import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { apps } from "@/lib/portfolio-data";
import { appsQuery } from "@/lib/cms";

export const Route = createFileRoute("/apps/$slug")({
  head: ({ loaderData }) => {
    const a: any = loaderData;
    const title = a?.name ? `${a.name} — App by Nour` : "App — Nour Eldein";
    const desc = a?.tagline ?? a?.description ?? "An app from Nour Eldein's portfolio.";
    const og = a?.cover?.asset ? urlFor(a.cover).width(1200).height(630).url() : undefined;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        ...(og ? [{ property: "og:image", content: og }, { name: "twitter:image", content: og }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const doc = await sanityClient.fetch(
      `*[_type=="app" && slug.current==$slug][0]`,
      { slug: params.slug },
    );
    if (!doc) {
      const fallbackDoc = apps.find(a => a.id === params.slug);
      if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      throw notFound();
    }
    return doc;
  },
  errorComponent: () => <DetailShell eyebrow="Error" title="Could not load this app" />,
  notFoundComponent: () => (
    <DetailShell eyebrow="404" title="App not found">
      <Link to="/apps" className="text-sm underline">Back to marketplace</Link>
    </DetailShell>
  ),
  component: AppDetail,
});

function AppDetail() {
  const initial: any = Route.useLoaderData();
  const { data: a } = useQuery({
    queryKey: ["cms", "app", initial.slug?.current],
    queryFn: async () => {
      const doc = await sanityClient.fetch(`*[_type=="app" && slug.current==$slug][0]`, { slug: initial.slug?.current });
      if (!doc) {
        const fallbackDoc = apps.find(f => f.id === initial.slug?.current);
        if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      }
      return doc;
    },
    initialData: initial,
  });
  const cover = a?.cover?.asset ? urlFor(a.cover).width(1600).url() : null;
  const meta = [a.category, a.downloads && `${a.downloads} downloads`, a.rating && `★ ${a.rating}`]
    .filter(Boolean).join(" · ");
  return (
    <DetailShell
      eyebrow={`App · ${a.category ?? ""}`}
      title={a.name}
      meta={meta}
      cover={cover}
      body={a.description ?? a.tagline}
    />
  );
}