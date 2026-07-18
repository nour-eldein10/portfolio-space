import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListReviews,
  adminSetReviewStatus,
  adminDeleteReview,
  adminApproveWithReply,
} from "@/lib/reviews.functions";
import { urlFor } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Check, X, Trash2, RotateCcw, Loader2, Mail, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const qc = useQueryClient();
  const list = useServerFn(adminListReviews);
  const setStatus = useServerFn(adminSetReviewStatus);
  const del = useServerFn(adminDeleteReview);
  const approveWithReply = useServerFn(adminApproveWithReply);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin", "reviews", "all"],
    queryFn: () => list({ data: {} }),
    refetchInterval: 15_000,
  });

  // Approve dialog state
  const [approveTarget, setApproveTarget] = useState<any | null>(null);
  const [replyMsg, setReplyMsg] = useState("");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["public", "reviews"] });
  };

  const approveMut = useMutation({
    mutationFn: (v: {
      id: string;
      reviewerName: string;
      reviewerEmail: string;
      reviewerQuote: string;
      replyMessage: string;
    }) => approveWithReply({ data: v }),
    onSuccess: () => {
      invalidate();
      toast.success(
        approveTarget?.email
          ? "Approved & notification email sent ✓"
          : "Approved ✓ (no email on file)",
      );
      setApproveTarget(null);
      setReplyMsg("");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const rejectMut = useMutation({
    mutationFn: (id: string) => setStatus({ data: { id, status: "rejected" } }),
    onSuccess: () => { invalidate(); toast.success("Rejected"); },
  });
  const unpublishMut = useMutation({
    mutationFn: (id: string) => setStatus({ data: { id, status: "pending" } }),
    onSuccess: () => { invalidate(); toast.success("Moved back to pending"); },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { invalidate(); toast.success("Deleted"); },
  });

  const groups = {
    pending: (reviews as any[]).filter((r) => r.status === "pending"),
    approved: (reviews as any[]).filter((r) => r.status === "approved"),
    rejected: (reviews as any[]).filter((r) => r.status === "rejected"),
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-20 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews…
      </div>
    );

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Reviews</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Approved reviews appear on the homepage. Accept to publish + notify the reviewer.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Pending", count: groups.pending.length, icon: Clock, color: "text-amber-500" },
          { label: "Approved", count: groups.approved.length, icon: CheckCircle2, color: "text-[color:var(--neon)]" },
          { label: "Rejected", count: groups.rejected.length, icon: XCircle, color: "text-destructive" },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="hairline rounded-2xl p-5 bg-surface/30 flex items-center gap-3">
            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
            <div>
              <p className="text-2xl font-display font-semibold">{count}</p>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PENDING QUEUE ── */}
      <Section title={`Pending Queue (${groups.pending.length})`} accent>
        {groups.pending.length === 0 && <Empty>No pending reviews — all caught up 🎉</Empty>}
        {groups.pending.map((r: any) => (
          <ReviewCard
            key={r._id}
            r={r}
            badge={<Badge variant="pending">Pending</Badge>}
            actions={
              <>
                <Button
                  size="sm"
                  className="bg-[color:var(--neon)] text-background hover:opacity-90"
                  onClick={() => { setApproveTarget(r); setReplyMsg(""); }}
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectMut.mutate(r._id)}
                  disabled={rejectMut.isPending}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" /> Reject
                </Button>
              </>
            }
          />
        ))}
      </Section>

      {/* ── APPROVED ── */}
      <Section title={`Live / Approved (${groups.approved.length})`}>
        {groups.approved.length === 0 && <Empty>No approved reviews yet.</Empty>}
        {groups.approved.map((r: any) => (
          <ReviewCard
            key={r._id}
            r={r}
            badge={<Badge variant="approved">Live</Badge>}
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => unpublishMut.mutate(r._id)}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Unpublish
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { if (confirm("Delete this review?")) delMut.mutate(r._id); }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </>
            }
          />
        ))}
      </Section>

      {/* ── REJECTED ── */}
      <Section title={`Rejected (${groups.rejected.length})`}>
        {groups.rejected.length === 0 && <Empty>None.</Empty>}
        {groups.rejected.map((r: any) => (
          <ReviewCard
            key={r._id}
            r={r}
            badge={<Badge variant="rejected">Rejected</Badge>}
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setApproveTarget(r); setReplyMsg(""); }}
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" /> Approve instead
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { if (confirm("Delete?")) delMut.mutate(r._id); }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </>
            }
          />
        ))}
      </Section>

      {/* ── APPROVE DIALOG ── */}
      <Dialog open={!!approveTarget} onOpenChange={(o) => { if (!o) { setApproveTarget(null); setReplyMsg(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-tight">
              Accept review
            </DialogTitle>
          </DialogHeader>

          {approveTarget && (
            <div className="space-y-4">
              {/* Read-only quote */}
              <div className="hairline rounded-xl p-4 bg-surface/30">
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Client review (read-only)
                </p>
                <p className="text-sm leading-relaxed italic">"{approveTarget.quote}"</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  — <span className="font-medium text-foreground">{approveTarget.author}</span>
                  {approveTarget.role && <> · {approveTarget.role}</>}
                </p>
              </div>

              {/* Reply composer */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {approveTarget.email
                    ? `Reply message to ${approveTarget.email}`
                    : "Reply message (no email on file — won't be sent)"}
                </label>
                <Textarea
                  rows={5}
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  placeholder={`Hi ${approveTarget.author},\n\nThanks so much for your kind words! Your review is now live on my portfolio.\n\nLooking forward to working together again!\n\n— Nour`}
                  className="resize-none text-sm"
                />
                {!approveTarget.email && (
                  <p className="text-xs text-muted-foreground">
                    ⚠ This reviewer didn't provide an email. The review will be approved but no email will be sent.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setApproveTarget(null); setReplyMsg(""); }}>
              Cancel
            </Button>
            <Button
              disabled={approveMut.isPending}
              onClick={() => {
                if (!approveTarget) return;
                approveMut.mutate({
                  id: approveTarget._id,
                  reviewerName: approveTarget.author,
                  reviewerEmail: approveTarget.email ?? "",
                  reviewerQuote: approveTarget.quote,
                  replyMessage: replyMsg,
                });
              }}
            >
              {approveMut.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…</>
              ) : (
                <><Check className="h-4 w-4 mr-2" /> Approve{approveTarget?.email ? " & Send Email" : ""}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className="mt-10">
      <h2
        className={`font-mono text-[11px] uppercase tracking-widest ${accent ? "text-[color:var(--neon)]" : "text-muted-foreground"}`}
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="hairline rounded-2xl p-6 text-sm text-muted-foreground text-center">
      {children}
    </div>
  );
}

function Badge({ variant, children }: { variant: "pending" | "approved" | "rejected"; children: React.ReactNode }) {
  const cls = {
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    approved: "bg-[color:var(--neon)]/10 text-[color:var(--neon)]",
    rejected: "bg-destructive/10 text-destructive",
  }[variant];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest ${cls}`}>
      {children}
    </span>
  );
}

function ReviewCard({
  r,
  actions,
  badge,
}: {
  r: any;
  actions: React.ReactNode;
  badge?: React.ReactNode;
}) {
  const avatarUrl = r.avatar?.asset ? urlFor(r.avatar).width(80).height(80).url() : null;

  return (
    <div className="hairline rounded-2xl p-5 bg-surface/30 flex gap-4 group hover:border-[color:var(--neon)]/40 transition-colors">
      {/* Avatar */}
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover shrink-0 mt-0.5" />
      ) : (
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-sm font-display font-medium text-muted-foreground">
          {r.author?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {badge}
          <span className="font-medium text-sm">{r.author}</span>
          {r.role && <span className="text-xs text-muted-foreground">· {r.role}</span>}
          {r.email && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {r.email}
            </span>
          )}
          {r.createdAt && (
            <span className="text-xs text-muted-foreground ml-auto">
              {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>

        {/* Quote (read-only display) */}
        <p className="text-sm leading-relaxed text-foreground/80 italic mb-4">"{r.quote}"</p>

        {/* Actions */}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>
  );
}
