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
