import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";

const ADMIN_EMAIL = "noureldein1100@gmail.com";

/** Submit a contact enquiry. Public — any visitor can submit. Inserts to Sanity + notifies admin. */
export const submitContact = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      email: string;
      phone?: string;
      budget?: string;
      productType?: string;
      message: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();

    // 1. Save to Sanity
    const doc = {
      _type: "contactEnquiry" as const,
      name: data.name.slice(0, 200),
      email: data.email.slice(0, 200),
      phone: data.phone?.slice(0, 50) ?? null,
      budget: data.budget ?? null,
      productType: data.productType?.slice(0, 200) ?? null,
      message: data.message.slice(0, 2000),
      status: "new",
      submittedAt: new Date().toISOString(),
    };

    const created = await client.create(doc);

    // 2. Notify admin via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);

      const rows = [
        ["Name", data.name],
        ["Email", data.email],
        data.phone ? ["Phone", data.phone] : null,
        data.budget ? ["Budget", data.budget] : null,
        data.productType ? ["Product Type", data.productType] : null,
      ]
        .filter(Boolean)
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px;font-weight:600;color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap">${label}</td><td style="padding:8px 12px;font-size:14px;color:#1c1917">${value}</td></tr>`,
        )
        .join("");

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: ADMIN_EMAIL,
        subject: `📬 New enquiry from ${data.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:620px;margin:auto;color:#1c1917">
            <div style="background:#0891b2;padding:24px 32px;border-radius:16px 16px 0 0">
              <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">New Contact Enquiry</h1>
              <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px">Submitted via your portfolio contact form</p>
            </div>
            <div style="background:#faf8f6;padding:24px 32px;border-radius:0 0 16px 16px;border:1px solid #e5e1dc">
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                ${rows}
              </table>
              <div style="background:#fff;border:1px solid #e5e1dc;border-radius:12px;padding:16px 20px">
                <p style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;margin:0 0 8px">Message</p>
                <p style="font-size:14px;line-height:1.7;color:#1c1917;margin:0;white-space:pre-wrap">${data.message}</p>
              </div>
              <p style="margin-top:20px;font-size:12px;color:#a8a29e">Reply directly to ${data.email}</p>
            </div>
          </div>
        `,
      });
    }

    return created as any;
  });

// ─── Admin functions ──────────────────────────────────────────────────────────

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** List all contact enquiries ordered by newest first. */
export const adminListEnquiries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { status?: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const filter = data.status ? `&& status == "${data.status}"` : "";
    const docs = await client.fetch(
      `*[_type == "contactEnquiry" ${filter}] | order(submittedAt desc)`,
    );
    return (docs ?? []) as any[];
  });

/** Mark an enquiry status (new → read → replied → archived). */
export const adminSetEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    await client.patch(data.id).set({ status: data.status }).commit();
    return { ok: true as const };
  });

/** Reply to an enquiry — marks as replied AND sends email to client. */
export const adminReplyEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (data: {
      id: string;
      clientName: string;
      clientEmail: string;
      clientMessage: string;
      replyMessage: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();

    // 1. Mark as replied in Sanity
    await client
      .patch(data.id)
      .set({ status: "replied", repliedAt: new Date().toISOString() })
      .commit();

    // 2. Send reply email to client
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.clientEmail,
        subject: `Re: Your enquiry — Nour Eldein`,
        html: `
          <div style="font-family:sans-serif;max-width:620px;margin:auto;color:#1c1917">
            <div style="background:#0891b2;padding:24px 32px;border-radius:16px 16px 0 0">
              <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">Hey ${data.clientName} 👋</h1>
              <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px">Reply from Nour Eldein</p>
            </div>
            <div style="background:#faf8f6;padding:24px 32px;border-radius:0 0 16px 16px;border:1px solid #e5e1dc">
              <div style="background:#fff;border:1px solid #e5e1dc;border-radius:12px;padding:16px 20px;margin-bottom:20px">
                <p style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;margin:0 0 8px">Your original message</p>
                <p style="font-size:13px;line-height:1.6;color:#78716c;margin:0;white-space:pre-wrap;font-style:italic">${data.clientMessage}</p>
              </div>
              <div style="background:#0891b2;border-radius:12px;padding:20px 24px;margin-bottom:24px">
                <p style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin:0 0 8px">Nour's reply</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#fff;white-space:pre-wrap">${data.replyMessage}</p>
              </div>
              <p style="font-size:13px;color:#a8a29e">— Nour Eldein · noureldein1100@gmail.com</p>
            </div>
          </div>
        `,
      });
    }

    return { ok: true as const };
  });

/** Delete an enquiry. */
export const adminDeleteEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    await client.delete(data.id);
    return { ok: true as const };
  });
