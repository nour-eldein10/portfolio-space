import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { DetailShell } from "@/components/site/detail-shell";
import { featuredProjects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ loaderData }) => {
    const p: any = loaderData;
    const title = p?.name ? `${p.name} — Project` : "Project — Nour Eldein";
    const desc = p?.summary ?? p?.description ?? "A project from Nour Eldein's portfolio.";
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
    const doc = await sanityClient.fetch(`*[_type=="project" && slug.current==$slug][0]`, {
      slug: params.slug,
    });
    if (!doc) {
      const fallbackDoc = featuredProjects.find((p) => p.id === params.slug);
      if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      throw notFound();
    }
    return doc;
  },
  errorComponent: () => <DetailShell eyebrow="Error" title="Could not load this project" />,
  notFoundComponent: () => (
    <DetailShell eyebrow="404" title="Project not found">
      <Link to="/" className="text-sm underline">
        Back home
      </Link>
    </DetailShell>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const initial: any = Route.useLoaderData();
  const { data: p } = useQuery({
    queryKey: ["cms", "project", initial.slug?.current],
    queryFn: async () => {
      const doc = await sanityClient.fetch(`*[_type=="project" && slug.current==$slug][0]`, {
        slug: initial.slug?.current,
      });
      if (!doc) {
        const fallbackDoc = featuredProjects.find((f) => f.id === initial.slug?.current);
        if (fallbackDoc) return { ...fallbackDoc, slug: { current: fallbackDoc.id } };
      }
      return doc;
    },
    initialData: initial,
  });
  const cover = p?.cover?.asset ? urlFor(p.cover).width(1600).url() : null;
  const meta = [p.year, p.role].filter(Boolean).join(" · ");
  return (
    <DetailShell
      eyebrow="Project"
      title={p.name}
      meta={meta}
      cover={cover}
      gallery={p.gallery}
      body={p.description ?? p.summary}
      stats={{
        rating: p.rating,
        reviews: p.reviews,
        downloads: p.downloads,
        category: p.role,
      }}
      actions={[
        { label: "Order your product", variant: "primary" }
      ]}
    />
  );
}
