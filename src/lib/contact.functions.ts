import { createServerFn } from "@tanstack/react-start";

/** Submit a contact enquiry. Public — any visitor can submit. */
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
    return created as any;
  });
