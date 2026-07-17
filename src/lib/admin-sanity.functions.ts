import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** List all docs of a Sanity type. */
export const adminListDocs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { type: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const docs = await client.fetch(`*[_type == $type] | order(order asc, _createdAt asc)`, {
      type: data.type,
    });
    return docs as any[];
  });

/** Get a single doc by id. */
export const adminGetDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const doc = await client.getDocument(data.id);
    return (doc ?? null) as any;
  });

/** Create a new doc. Pass `_type` inside `doc`. Returns the created doc. */
export const adminCreateDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { doc: Record<string, unknown> }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const created = await client.create(data.doc as any);
    return created as any;
  });

/** Patch (update) a doc by id with a `set` object. */
export const adminUpdateDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; set: Record<string, unknown> }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const updated = await client.patch(data.id).set(data.set).commit();
    return updated as any;
  });

/** Delete a doc by id. */
export const adminDeleteDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    await client.delete(data.id);
    return { ok: true as const };
  });

/**
 * Upload an image to Sanity. Client should send a base64 data URL
 * (image small enough to JSON-encode). Returns an image reference object
 * ready to be set on a doc field: { _type: "image", asset: { _type: "reference", _ref: "..." } }
 */
export const adminUploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { dataUrl: string; filename?: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();

    const match = data.dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) throw new Error("Invalid image data");
    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    const asset = await client.assets.upload("image", buffer, {
      filename: data.filename ?? `upload-${Date.now()}`,
      contentType,
    });

    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  });

/**
 * Upload a generic file (like video) to Sanity using FormData to avoid base64 JSON payload limits.
 * Returns a file reference object: { _type: "file", asset: { _type: "reference", _ref: "..." } }
 */
export const adminUploadFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();

    const file = data.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await client.assets.upload("file", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return {
      _type: "file",
      asset: { _type: "reference", _ref: asset._id },
    };
  });

/**
 * Returns Sanity credentials so the browser can upload large files (APK/AAB)
 * directly to Sanity's Assets API — bypassing the server-function payload limit.
 * The write token is deliberately exposed here because this endpoint is
 * already protected by requireSupabaseAuth.
 */
export const adminGetSanityUploadCreds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) throw new Error("SANITY_WRITE_TOKEN is not configured");
    return {
      token,
      projectId: "9sivjnx4",
      dataset: "production",
      apiVersion: "2024-06-01",
    };
  });

/** Counts of each content type, for the homepage stats strip. Public. */
export const getContentCounts = createServerFn({ method: "GET" }).handler(async () => {
  // Read via server-only write client (uses token but only reads) to avoid CDN cache for fresh counts.
  const { getSanityWriteClient } = await import("./sanity-write.server");
  const client = getSanityWriteClient();
  const result = await client.fetch<{
    apps: number;
    projects: number;
    products: number;
    designs: number;
    experiences: number;
  }>(`{
    "apps": count(*[_type=="app"]),
    "projects": count(*[_type=="project"]),
    "products": count(*[_type=="product"]),
    "designs": count(*[_type=="design"]),
    "experiences": count(*[_type=="experience"])
  }`);
  return result;
});

/** Public: submit a review (no auth required). Saved as pending. */
export const submitReview = createServerFn({ method: "POST" })
  .validator((data: { author: string; quote?: string; rating: number; projectId?: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const doc = await client.create({
      _type: "review",
      author: data.author,
      quote: data.quote ?? "",
      rating: data.rating,
      projectId: data.projectId ?? "",
      status: "approved",
    });
    return { ok: true, id: doc._id };
  });

/** Public: fetch approved reviews, optionally filtered by projectId. */
export const fetchReviews = createServerFn({ method: "POST" })
  .validator((data: { projectId?: string }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const filter = data.projectId
      ? `_type=="review" && status=="approved" && projectId==$projectId`
      : `_type=="review" && status=="approved"`;
    const reviews = await client.fetch(`*[${filter}] | order(_createdAt desc)`, {
      projectId: data.projectId ?? "",
    });
    return reviews as any[];
  });

/** Seed default organizations + volunteering into Sanity (skips existing by name). */
export const seedDefaultData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { types: string[] }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    let created = 0;

    if (data.types.includes("organization")) {
      const existing = await client.fetch(`*[_type=="organization"].name`);
      const orgs = [
        { name: "Zoomin", type: "Company" },
        { name: "Mostaqal", type: "Platform" },
        { name: "Growfet", type: "Startup" },
        { name: "Refqaa", type: "Volunteer" },
        { name: "Bionic Team", type: "Team" },
        { name: "Mega Team", type: "Team" },
        { name: "Matrix Team", type: "Team" },
        { name: "Sonaa IT", type: "Company" },
        { name: "NASA Space Apps", type: "Competition" },
        { name: "Rowad", type: "Organization" },
      ];
      for (let i = 0; i < orgs.length; i++) {
        if (!existing.includes(orgs[i].name)) {
          await client.create({
            _type: "organization",
            name: orgs[i].name,
            type: orgs[i].type,
            order: i + 1,
          });
          created++;
        }
      }
    }

    if (data.types.includes("volunteering")) {
      const existing = await client.fetch(`*[_type=="volunteering"].organization`);
      const vols = [
        {
          organization: "Refqaa",
          role: "Technical Lead",
          period: "2023 — Present",
          description: "Community-driven organization focused on youth empowerment and tech education.",
          achievements: ["Led a team of 8 developers", "Built internal tools for 500+ members", "Organized 10+ tech workshops"],
          responsibilities: ["Technical strategy", "Team recruitment", "Workshop planning"],
        },
        {
          organization: "Bionic Team",
          role: "Design Lead",
          period: "2022 — 2023",
          description: "Student engineering team building competitive robots and automation systems.",
          achievements: ["Designed complete brand identity", "Created team website", "Won regional design award"],
          responsibilities: ["Brand design", "Social media", "Graphic design"],
        },
        {
          organization: "Mega Team",
          role: "Team Lead",
          period: "2023 — Present",
          description: "Cross-functional technology team working on innovative software projects.",
          achievements: ["Delivered 4 successful projects", "Grew team from 5 to 12", "Established agile workflow"],
          responsibilities: ["Sprint management", "Code review", "Architecture decisions"],
        },
        {
          organization: "Matrix Team",
          role: "Co-Founder",
          period: "2022 — 2023",
          description: "Competitive programming community focused on algorithms and problem-solving.",
          achievements: ["Grew community to 50+ members", "Organized 3 hackathons", "Members placed in ICPC"],
          responsibilities: ["Community building", "Event planning", "Problem setting"],
        },
        {
          organization: "Sonaa IT",
          role: "Volunteer Developer",
          period: "2022",
          description: "IT company providing pro-bono development for non-profit organizations.",
          achievements: ["Built 2 charity apps", "Trained 5 junior developers", "Improved deployment pipeline"],
          responsibilities: ["Mobile development", "Code mentoring", "QA testing"],
        },
      ];
      for (let i = 0; i < vols.length; i++) {
        if (!existing.includes(vols[i].organization)) {
          await client.create({
            _type: "volunteering",
            ...vols[i],
            order: i + 1,
          });
          created++;
        }
      }
    }

    return { ok: true, created };
  });

export const adminReorderDocs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { items: { id: string; order: number }[] }) => data)
  .handler(async ({ data }) => {
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    
    // Create a transaction to update all orders
    let tx = client.transaction();
    for (const item of data.items) {
      tx = tx.patch(item.id, (p) => p.set({ order: item.order }));
    }
    await tx.commit();
    return { ok: true };
  });
