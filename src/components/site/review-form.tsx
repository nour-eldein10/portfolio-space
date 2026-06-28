import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "@/lib/reviews.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ImagePlus } from "lucide-react";

export function ReviewForm() {
  const qc = useQueryClient();
  const submit = useServerFn(submitReview);

  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarDataUrl(result);
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  }

  const mut = useMutation({
    mutationFn: () =>
      submit({
        data: {
          author,
          role: role || undefined,
          quote,
          avatarDataUrl: avatarDataUrl || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Thanks — your review is pending approval.");
      setAuthor("");
      setRole("");
      setQuote("");
      setAvatarDataUrl(null);
      setAvatarPreview(null);
      qc.invalidateQueries({ queryKey: ["public", "reviews"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (author && quote) mut.mutate();
      }}
      className="mt-12 hairline rounded-3xl p-8 bg-background"
    >
      <h3 className="font-display text-2xl tracking-tight">Leave a review</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reviews appear after a quick approval check.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="r-author">Name</Label>
          <Input
            id="r-author"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-role">Role / company (optional)</Label>
          <Input
            id="r-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="r-quote">Your review</Label>
          <Textarea
            id="r-quote"
            required
            rows={4}
            maxLength={800}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
        </div>

        {/* Avatar upload */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Profile picture (optional)</Label>
          <div className="flex items-center gap-4">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
              />
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <span className="inline-flex items-center gap-2 px-3 py-2 hairline rounded-md text-sm hover:bg-surface/50 transition-colors">
                <ImagePlus className="h-4 w-4" />
                {avatarPreview ? "Change photo" : "Upload photo"}
              </span>
            </label>
          </div>
        </div>
      </div>
      <Button type="submit" className="mt-6" disabled={mut.isPending}>
        {mut.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Submit review
      </Button>
    </form>
  );
}
