import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "@/lib/reviews.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ReviewForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const submit = useServerFn(submitReview);

  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setSignedIn(!!s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const mut = useMutation({
    mutationFn: () => submit({ data: { author, role: role || undefined, quote } }),
    onSuccess: () => {
      toast.success("Thanks — your review is pending approval.");
      setAuthor(""); setRole(""); setQuote("");
      qc.invalidateQueries({ queryKey: ["public", "reviews"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit"),
  });

  if (signedIn === false) {
    return (
      <div className="mt-12 hairline rounded-3xl p-8 bg-background text-center">
        <p className="text-sm text-muted-foreground">
          Want to leave a review?{" "}
          <button onClick={() => navigate({ to: "/auth" })} className="text-foreground underline underline-offset-4 hover:text-[color:var(--neon)]">
            Sign in
          </button>
          {" "}first.
        </p>
      </div>
    );
  }

  if (!signedIn) return null;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (author && quote) mut.mutate(); }}
      className="mt-12 hairline rounded-3xl p-8 bg-background"
    >
      <h3 className="font-display text-2xl tracking-tight">Leave a review</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reviews appear after a quick approval check.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="r-author">Name</Label>
          <Input id="r-author" required value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-role">Role / company (optional)</Label>
          <Input id="r-role" value={role} onChange={(e) => setRole(e.target.value)} maxLength={100} />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="r-quote">Your review</Label>
          <Textarea id="r-quote" required rows={4} maxLength={800} value={quote} onChange={(e) => setQuote(e.target.value)} />
        </div>
      </div>
      <Button type="submit" className="mt-6" disabled={mut.isPending}>
        {mut.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Submit review
      </Button>
    </form>
  );
}