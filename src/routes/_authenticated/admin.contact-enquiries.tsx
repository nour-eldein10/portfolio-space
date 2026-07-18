import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListEnquiries,
  adminSetEnquiryStatus,
  adminReplyEnquiry,
  adminDeleteEnquiry,
} from "@/lib/contact.functions";
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
import { Check, Trash2, Loader2, Mail, Clock, CheckCircle2, Archive, DollarSign, Smartphone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/contact-enquiries")({
  component: AdminContactEnquiries,
});

function AdminContactEnquiries() {
  const qc = useQueryClient();
  const list = useServerFn(adminListEnquiries);
  const setStatus = useServerFn(adminSetEnquiryStatus);
  const del = useServerFn(adminDeleteEnquiry);
  const replyToEnquiry = useServerFn(adminReplyEnquiry);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["admin", "enquiries", "all"],
    queryFn: () => list({ data: {} }),
    refetchInterval: 15_000,
  });

  // Reply dialog state
  const [replyTarget, setReplyTarget] = useState<any | null>(null);
  const [replyMsg, setReplyMsg] = useState("");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "enquiries"] });
  };

  const replyMut = useMutation({
    mutationFn: (v: {
      id: string;
      clientName: string;
      clientEmail: string;
      clientMessage: string;
      replyMessage: string;
    }) => replyToEnquiry({ data: v }),
    onSuccess: () => {
      invalidate();
      toast.success("Reply sent & marked as replied ✓");
      setReplyTarget(null);
      setReplyMsg("");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to send reply"),
  });

  const setStatusMut = useMutation({
    mutationFn: (v: { id: string; status: string }) => setStatus({ data: v }),
    onSuccess: () => { invalidate(); toast.success("Status updated"); },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { invalidate(); toast.success("Deleted"); },
  });

  const groups = {
    new: (enquiries as any[]).filter((r) => r.status === "new" || !r.status),
    replied: (enquiries as any[]).filter((r) => r.status === "replied"),
    archived: (enquiries as any[]).filter((r) => r.status === "archived"),
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-20 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading enquiries…
      </div>
    );

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Contact Enquiries</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage incoming project requests. Reply to send an email directly to the client.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "New", count: groups.new.length, icon: Clock, color: "text-[color:var(--neon)]" },
          { label: "Replied", count: groups.replied.length, icon: CheckCircle2, color: "text-green-500" },
          { label: "Archived", count: groups.archived.length, icon: Archive, color: "text-muted-foreground" },
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

      {/* ── NEW QUEUE ── */}
      <Section title={`New Enquiries (${groups.new.length})`} accent>
        {groups.new.length === 0 && <Empty>No new enquiries.</Empty>}
        {groups.new.map((r: any) => (
          <EnquiryCard
            key={r._id}
            r={r}
            badge={<Badge variant="new">New</Badge>}
            actions={
              <>
                <Button
                  size="sm"
                  className="bg-[color:var(--neon)] text-background hover:opacity-90"
                  onClick={() => { setReplyTarget(r); setReplyMsg(""); }}
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5" /> Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusMut.mutate({ id: r._id, status: "archived" })}
                >
                  <Archive className="h-3.5 w-3.5 mr-1.5" /> Archive
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

      {/* ── REPLIED ── */}
      <Section title={`Replied (${groups.replied.length})`}>
        {groups.replied.length === 0 && <Empty>No replied enquiries.</Empty>}
        {groups.replied.map((r: any) => (
          <EnquiryCard
            key={r._id}
            r={r}
            badge={<Badge variant="replied">Replied</Badge>}
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusMut.mutate({ id: r._id, status: "archived" })}
                >
                  <Archive className="h-3.5 w-3.5 mr-1.5" /> Archive
                </Button>
              </>
            }
          />
        ))}
      </Section>

      {/* ── ARCHIVED ── */}
      <Section title={`Archived (${groups.archived.length})`}>
        {groups.archived.length === 0 && <Empty>None.</Empty>}
        {groups.archived.map((r: any) => (
          <EnquiryCard
            key={r._id}
            r={r}
            badge={<Badge variant="archived">Archived</Badge>}
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusMut.mutate({ id: r._id, status: "new" })}
                >
                  Move to New
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

      {/* ── REPLY DIALOG ── */}
      <Dialog open={!!replyTarget} onOpenChange={(o) => { if (!o) { setReplyTarget(null); setReplyMsg(""); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-tight">
              Reply to {replyTarget?.name}
            </DialogTitle>
          </DialogHeader>

          {replyTarget && (
            <div className="space-y-4">
              {/* Read-only details */}
              <div className="hairline rounded-xl p-4 bg-surface/30 space-y-3">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-widest font-mono block mb-1">Budget</span>
                    <span className="flex items-center gap-1 font-medium"><DollarSign className="h-3 w-3" /> {replyTarget.budget || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-widest font-mono block mb-1">Product</span>
                    <span className="flex items-center gap-1 font-medium"><Smartphone className="h-3 w-3" /> {replyTarget.productType || "Not specified"}</span>
                  </div>
                  {replyTarget.phone && (
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-widest font-mono block mb-1">Phone</span>
                      <span className="font-medium">{replyTarget.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-2 border-t hairline">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">Message (read-only)</span>
                  <p className="text-sm leading-relaxed italic text-foreground/90 whitespace-pre-wrap">"{replyTarget.message}"</p>
                </div>
              </div>

              {/* Reply composer */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Reply email to {replyTarget.email}
                </label>
                <Textarea
                  rows={6}
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  placeholder={`Hi ${replyTarget.name},\n\nThanks for reaching out about your project. I'd love to discuss this further...\n\nBest,\nNour`}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setReplyTarget(null); setReplyMsg(""); }}>
              Cancel
            </Button>
            <Button
              disabled={replyMut.isPending || !replyMsg.trim()}
              onClick={() => {
                if (!replyTarget || !replyMsg.trim()) return;
                replyMut.mutate({
                  id: replyTarget._id,
                  clientName: replyTarget.name,
                  clientEmail: replyTarget.email,
                  clientMessage: replyTarget.message,
                  replyMessage: replyMsg,
                });
              }}
            >
              {replyMut.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…</>
              ) : (
                <><Mail className="h-4 w-4 mr-2" /> Send Reply Email</>
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

function Badge({ variant, children }: { variant: "new" | "replied" | "archived"; children: React.ReactNode }) {
  const cls = {
    new: "bg-[color:var(--neon)]/10 text-[color:var(--neon)]",
    replied: "bg-green-500/10 text-green-600 dark:text-green-400",
    archived: "bg-muted text-muted-foreground",
  }[variant];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest ${cls}`}>
      {children}
    </span>
  );
}

function EnquiryCard({
  r,
  actions,
  badge,
}: {
  r: any;
  actions: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="hairline rounded-2xl p-5 bg-surface/30 flex flex-col sm:flex-row gap-4 group hover:border-[color:var(--neon)]/40 transition-colors">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-sm font-display font-medium text-muted-foreground">
        {r.name?.[0]?.toUpperCase() ?? "?"}
      </div>

      <div className="flex-1 min-w-0">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {badge}
          <span className="font-medium text-sm">{r.name}</span>
          {r.email && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {r.email}
            </span>
          )}
          {r.submittedAt && (
            <span className="text-xs text-muted-foreground ml-auto">
              {new Date(r.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        
        {/* Project Details */}
        <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
          {r.productType && (
            <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md hairline">
              <Smartphone className="h-3 w-3" /> {r.productType}
            </span>
          )}
          {r.budget && (
            <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md hairline">
              <DollarSign className="h-3 w-3" /> {r.budget}
            </span>
          )}
        </div>

        {/* Message (read-only display) */}
        <p className="text-sm leading-relaxed text-foreground/90 italic mb-4 line-clamp-3 overflow-hidden text-ellipsis">"{r.message}"</p>

        {/* Actions */}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>
  );
}
