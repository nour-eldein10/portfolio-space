import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { submitReview, fetchReviews } from "@/lib/admin-sanity.functions";
import { toast } from "sonner";
import { Star, Loader2, Pencil, X, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectReviews({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const fetchFn = useServerFn(fetchReviews);
  const submitFn = useServerFn(submitReview);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["sanity_reviews", projectId],
    queryFn: () => fetchFn({ data: { projectId } }),
  });

  const submitMut = useMutation({
    mutationFn: async () => {
      if (!author.trim()) throw new Error("Name is required");
      if (!rating) throw new Error("Please select a rating");
      return submitFn({ data: { author: author.trim(), quote: quote.trim(), rating, projectId } });
    },
    onSuccess: () => {
      setSubmitted(true);
      qc.invalidateQueries({ queryKey: ["sanity_reviews", projectId] });
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setQuote("");
        setAuthor("");
        setRating(0);
      }, 2500);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const stats = useMemo(() => {
    const total = reviews.length;
    let sum = 0;
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      if (r.rating) {
        sum += r.rating;
        counts[r.rating]++;
      }
    }
    return { total, average: total > 0 ? (sum / total).toFixed(1) : null, counts };
  }, [reviews]);

  const displayStar = hovered || rating;

  return (
    <section className="mt-24 pt-16 border-t border-border/30">
      <div className="grid md:grid-cols-[280px_1fr] gap-12">
        {/* ─── Left: Rating Summary ─── */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">Reviews</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest">
              What people say
            </p>
          </div>

          {stats.average ? (
            <div className="space-y-5">
              <div className="flex items-end gap-4">
                <span className="text-7xl font-display font-medium tracking-tighter leading-none text-foreground">
                  {stats.average}
                </span>
                <div className="pb-2 space-y-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= parseFloat(stats.average!) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total} {stats.total === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.counts[star] ?? 0;
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-3 text-xs text-muted-foreground font-mono">{star}</span>
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-amber-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: (5 - star) * 0.05 }}
                        />
                      </div>
                      <span className="w-4 text-[10px] text-muted-foreground font-mono text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2 rounded-2xl hairline bg-surface/20">
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-muted text-muted" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            </div>
          )}

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full rounded-xl gap-2"
              variant="outline"
            >
              <Pencil className="w-3.5 h-3.5" />
              Write a review
            </Button>
          )}
        </div>

        {/* ─── Right: Form + List ─── */}
        <div className="space-y-8">
          {/* Submit Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl hairline bg-surface/20 backdrop-blur-sm overflow-hidden"
              >
                {submitted ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-[color:var(--neon)]" />
                    <p className="font-medium">Review posted!</p>
                    <p className="text-sm text-muted-foreground">
                      Thank you for sharing your thoughts.
                    </p>
                  </div>
                ) : (
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Your rating</p>
                      <button
                        type="button"
                        aria-label="Close form"
                        onClick={() => setShowForm(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Star Picker */}
                    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                          onMouseEnter={() => setHovered(s)}
                          onClick={() => setRating(s)}
                          className="group transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${s <= displayStar ? "fill-amber-400 text-amber-400" : "fill-muted text-muted group-hover:text-amber-300"}`}
                          />
                        </button>
                      ))}
                      {displayStar > 0 && (
                        <span className="ml-2 self-center text-sm text-muted-foreground">
                          {["", "Poor", "Fair", "Good", "Great", "Excellent"][displayStar]}
                        </span>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Your name *"
                        className="rounded-xl"
                      />
                    </div>
                    <Textarea
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Share your experience (optional)..."
                      rows={3}
                      className="resize-none rounded-xl"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => submitMut.mutate()}
                        disabled={submitMut.isPending || !rating || !author.trim()}
                        className="rounded-xl px-6"
                      >
                        {submitMut.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Post Review"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 && !showForm ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-muted-foreground text-sm">Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {reviews.map((r: any, idx: number) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="py-6 first:pt-0 space-y-3"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[color:var(--neon)]/20 to-[color:var(--amber)]/20 flex items-center justify-center text-sm font-semibold font-mono text-[color:var(--neon)]">
                      {r.author?.[0]?.toUpperCase() || "A"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-medium text-sm">{r.author || "Anonymous"}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= (r.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                        {r._createdAt && (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {formatDistanceToNow(new Date(r._createdAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      {r.quote && (
                        <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
                          {r.quote}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
