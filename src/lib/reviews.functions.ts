import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Submit a new review. Public — any visitor can submit. Inserts as pending. */
export const submitReview = createServerFn({ method: "POST" })
  .validator(
    (data: { author: string; role?: string; quote: string; avatarDataUrl?: string }) => data,
  )
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();

    let avatarRef: { _type: "reference"; _ref: string } | undefined;

    if (data.avatarDataUrl) {
      const match = data.avatarDataUrl.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        const contentType = match[1];
        const buffer = Buffer.from(match[2], "base64");
        const asset = await client.assets.upload("image", buffer, {
          filename: `review-avatar-${Date.now()}`,
          contentType,
        });
        avatarRef = { _type: "reference", _ref: asset._id };
      }
    }

    const doc: Record<string, unknown> = {
      _type: "review",
      author: data.author.slice(0, 100),
      role: data.role?.slice(0, 100) ?? null,
      quote: data.quote.slice(0, 800),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (avatarRef) {
      doc.avatar = { _type: "image", asset: avatarRef };
    }

    const created = await client.create(doc);
    return created;
  });

/** Admin: list all reviews by status. */
export const adminListReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { status?: "pending" | "approved" | "rejected" }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const filter = data.status ? `&& status == "${data.status}"` : "";
    const reviews = await client.fetch(`*[_type == "review" ${filter}] | order(createdAt desc)`);
    return (reviews ?? []) as any[];
  });

/** Admin: change a review status. */
export const adminSetReviewStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; status: "pending" | "approved" | "rejected" }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    await client.patch(data.id).set({ status: data.status }).commit();
    return { ok: true as const };
  });

/** Admin: delete a review. */
export const adminDeleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    await client.delete(data.id);
    return { ok: true as const };
  });

/** Server fn that reports whether the current user is an admin. */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    return { isAdmin: true };
  });
