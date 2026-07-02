import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, Loader2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function ProjectReviews({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["project_reviews", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const submitMut = useMutation({
    mutationFn: async () => {
      if (!author.trim()) throw new Error("Name is required");
      const { error } = await supabase.from("reviews").insert({
        project_id: projectId,
        author: author.trim(),
        quote: quote.trim(),
        rating,
        status: "pending", // require admin approval
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review submitted for approval!");
      setShowForm(false);
      setQuote("");
      setAuthor("");
      setRating(5);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const stats = useMemo(() => {
    const total = reviews.length;
    let sum = 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      if (r.rating) {
        sum += r.rating;
        counts[r.rating as keyof typeof counts]++;
      }
    }
    return {
      total,
      average: total > 0 ? (sum / total).toFixed(1) : "0.0",
      counts,
    };
  }, [reviews]);

  return (
    <section className="mt-20 pt-16 border-t hairline space-y-10">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Summary */}
        <div className="md:w-1/3 shrink-0 space-y-6">
          <h2 className="font-display text-2xl font-medium tracking-tight">Ratings and reviews</h2>
          <p className="text-sm text-muted-foreground">Ratings and reviews are verified and are from people who use the same type of device that you use.</p>
          
          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-display font-medium tracking-tighter">{stats.average}</span>
              <div className="flex items-center text-amber-500 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= parseFloat(stats.average) ? "fill-current" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{stats.total} reviews</span>
            </div>

            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.counts[star as keyof typeof stats.counts];
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-2 text-muted-foreground">{star}</span>
                    <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-[color:var(--neon)] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: List & Form */}
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">User Reviews</h3>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="rounded-full">
                Write a review
              </Button>
            )}
          </div>

          {showForm && (
            <div className="p-5 rounded-2xl bg-surface/30 hairline space-y-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} className={`p-1 hover:scale-110 transition-transform ${s <= rating ? "text-amber-500" : "text-muted"}`}>
                    <Star className={`w-6 h-6 ${s <= rating ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
              <Input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full sm:w-64"
              />
              <Textarea 
                value={quote} 
                onChange={e => setQuote(e.target.value)} 
                placeholder="Describe your experience (optional)" 
                rows={3} 
                className="resize-none" 
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowForm(false)} disabled={submitMut.isPending}>Cancel</Button>
                <Button onClick={() => submitMut.mutate()} disabled={submitMut.isPending || !rating || !author.trim()}>
                  {submitMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {isLoading && <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}
            
            {!isLoading && reviews.length === 0 && !showForm && (
              <div className="text-center py-12 text-muted-foreground text-sm">No reviews yet. Be the first!</div>
            )}

            {reviews.map((r) => (
              <div key={r.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[color:var(--neon)]/10 text-[color:var(--neon)] flex items-center justify-center font-mono text-lg font-medium">
                      {r.author?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{r.author || "Anonymous"}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= (r.rating || 5) ? "fill-current" : "text-muted"}`} />
                          ))}
                        </div>
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                {r.quote && <p className="text-[13px] leading-relaxed text-foreground/90">{r.quote}</p>}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>Was this review helpful?</span>
                  <div className="flex gap-2">
                    <button className="hover:text-foreground hover:bg-surface px-2 py-1 rounded transition-colors">Yes</button>
                    <button className="hover:text-foreground hover:bg-surface px-2 py-1 rounded transition-colors">No</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
