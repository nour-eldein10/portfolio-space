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
  const cover = d?.cover?.asset ? urlFor(d.cover).width(1600).url() : null;
  return (
    <DetailShell
      eyebrow={`Design · ${d.category ?? ""}`}
      title={d.title}
      cover={cover}
      body={d.description}
    />
  );
}
