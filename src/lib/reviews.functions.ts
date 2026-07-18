import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Submit a new review. Public — any visitor can submit. Inserts as pending. */
export const submitReview = createServerFn({ method: "POST" })
  .validator(
    (data: { author: string; role?: string; quote: string; avatarDataUrl?: string; email?: string }) => data,
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

    const doc = {
      _type: "review" as const,
      author: data.author.slice(0, 100),
      role: data.role?.slice(0, 100) ?? null,
      quote: data.quote.slice(0, 800),
      email: data.email?.slice(0, 200) ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...(avatarRef ? { avatar: { _type: "image" as const, asset: avatarRef } } : {}),
    };

    const created = await client.create(doc);
    return created as any;
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

/**
 * Admin: approve a review AND send an acceptance email to the reviewer.
 * Uses Resend API (set RESEND_API_KEY env var).
 */
export const adminApproveWithReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (data: {
      id: string;
      reviewerName: string;
      reviewerEmail: string;
      reviewerQuote: string;
      replyMessage: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();

    // 1. Approve in Sanity
    await client.patch(data.id).set({ status: "approved" }).commit();

    // 2. Send email via Resend SDK
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && data.reviewerEmail) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#1c1917">
          <h2 style="font-size:24px;font-weight:600;margin-bottom:8px">Hi ${data.reviewerName} 👋</h2>
          <p style="color:#78716c;font-size:14px;margin-bottom:24px">
            Your review on <strong>Nour Eldein's portfolio</strong> has been approved and is now live.
          </p>
          <blockquote style="border-left:3px solid #0891b2;margin:0 0 24px;padding:12px 20px;background:#f5f0ec;border-radius:0 8px 8px 0;font-style:italic;color:#44403c">
            "${data.reviewerQuote}"
          </blockquote>
          ${data.replyMessage
            ? `<div style="background:#f5f0ec;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#78716c;margin:0 0 8px">Message from Nour</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#1c1917">${data.replyMessage.replace(/\n/g, "<br/>")}</p>
            </div>`
            : ""}
          <p style="font-size:13px;color:#78716c">Thank you for taking the time to share your experience 🙏</p>
          <p style="font-size:13px;color:#78716c;margin-top:4px">— Nour Eldein</p>
        </div>
      `;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.reviewerEmail,
        subject: "Your review has been approved ✓",
        html,
      });
    }

    return { ok: true as const };
  });

