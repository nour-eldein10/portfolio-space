import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListReviews } from "@/lib/reviews.functions";
import { getContentCounts } from "@/lib/admin-sanity.functions";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const listReviews = useServerFn(adminListReviews);
  const counts = useServerFn(getContentCounts);

  const { data: pending = [] } = useQuery({
    queryKey: ["admin", "reviews", "pending"],
    queryFn: () => listReviews({ data: { status: "pending" } }),
  });
  const { data: countData } = useQuery({
    queryKey: ["stats", "content"],
    queryFn: () => counts(),
  });

  const tiles = [
    { label: "Apps", value: countData?.apps ?? "—", to: "/admin/apps" },
    { label: "Projects", value: countData?.projects ?? "—", to: "/admin/projects" },
    { label: "Designs", value: countData?.designs ?? "—", to: "/admin/designs" },
    { label: "Experience entries", value: countData?.experiences ?? "—", to: "/admin/experience" },
    { label: "Pending reviews", value: pending.length, to: "/admin/reviews" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Overview</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Everything you see on the site is editable from here. Changes go live instantly.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to as any} className="group hairline rounded-2xl p-6 bg-surface/30 hover:bg-surface/60 transition-colors">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{t.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-4 font-display text-4xl tracking-tight">{t.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}