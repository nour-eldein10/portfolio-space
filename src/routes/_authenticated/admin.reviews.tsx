import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListReviews, adminSetReviewStatus, adminDeleteReview } from "@/lib/reviews.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Trash2, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const qc = useQueryClient();
  const list = useServerFn(adminListReviews);
  const setStatus = useServerFn(adminSetReviewStatus);
  const del = useServerFn(adminDeleteReview);

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin", "reviews", "all"],
    queryFn: () => list({ data: {} }),
  });

  useEffect(() => {
    const ch = supabase
      .channel("admin-reviews")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
        qc.invalidateQueries({ queryKey: ["public", "reviews"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const setStatusMut = useMutation({
    mutationFn: (v: { id: string; status: "pending" | "approved" | "rejected" }) =>
      setStatus({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Updated");
    },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Deleted");
    },
  });

  const groups = {
    pending: reviews.filter((r: any) => r.status === "pending"),
    approved: reviews.filter((r: any) => r.status === "approved"),
    rejected: reviews.filter((r: any) => r.status === "rejected"),
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Reviews</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Approved reviews appear on the homepage. Updates stream in real-time.
      </p>

      <Section title={`Pending (${groups.pending.length})`}>
        {groups.pending.length === 0 && <Empty>No pending reviews.</Empty>}
        {groups.pending.map((r: any) => (
          <ReviewRow
            key={r.id}
            r={r}
            actions={
              <>
                <Button
                  size="sm"
                  onClick={() => setStatusMut.mutate({ id: r.id, status: "approved" })}
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusMut.mutate({ id: r.id, status: "rejected" })}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </>
            }
          />
        ))}
      </Section>

      <Section title={`Approved (${groups.approved.length})`}>
        {groups.approved.length === 0 && <Empty>No approved reviews yet.</Empty>}
        {groups.approved.map((r: any) => (
          <ReviewRow
            key={r.id}
            r={r}
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusMut.mutate({ id: r.id, status: "pending" })}
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Unpublish
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm("Delete?")) delMut.mutate(r.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            }
          />
        ))}
      </Section>

      <Section title={`Rejected (${groups.rejected.length})`}>
        {groups.rejected.length === 0 && <Empty>None.</Empty>}
        {groups.rejected.map((r: any) => (
          <ReviewRow
            key={r.id}
            r={r}
            actions={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm("Delete?")) delMut.mutate(r.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
          />
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="hairline rounded-2xl p-6 text-sm text-muted-foreground">{children}</div>;
}
function ReviewRow({ r, actions }: { r: any; actions: React.ReactNode }) {
  return (
    <div className="hairline rounded-2xl p-5 bg-surface/30">
      <p className="text-sm leading-relaxed">"{r.quote}"</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{r.author}</span>
          {r.role && <> · {r.role}</>}
          <> · {new Date(r.created_at).toLocaleDateString()}</>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>
  );
}
