import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden: admin only");
}

/** List all docs of a Sanity type. */
export const adminListDocs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { type: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const docs = await client.fetch(
      `*[_type == $type] | order(order asc, _createdAt asc)`,
      { type: data.type },
    );
    return docs as any[];
  });

/** Get a single doc by id. */
export const adminGetDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const doc = await client.getDocument(data.id);
    return (doc ?? null) as any;
  });

/** Create a new doc. Pass `_type` inside `doc`. Returns the created doc. */
export const adminCreateDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { doc: Record<string, unknown> }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const created = await client.create(data.doc as any);
    return created as any;
  });

/** Patch (update) a doc by id with a `set` object. */
export const adminUpdateDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; set: Record<string, unknown> }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { getSanityWriteClient } = await import("./sanity-write.server");
    const client = getSanityWriteClient();
    const updated = await client.patch(data.id).set(data.set).commit();
    return updated as any;
  });

/** Delete a doc by id. */
export const adminDeleteDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
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
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
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

/** Counts of each content type, for the homepage stats strip. Public. */
export const getContentCounts = createServerFn({ method: "GET" }).handler(async () => {
  // Read via server-only write client (uses token but only reads) to avoid CDN cache for fresh counts.
  const { getSanityWriteClient } = await import("./sanity-write.server");
  const client = getSanityWriteClient();
  const result = await client.fetch<{
    apps: number; projects: number; designs: number; experiences: number;
  }>(`{
    "apps": count(*[_type=="app"]),
    "projects": count(*[_type=="project"]),
    "designs": count(*[_type=="design"]),
    "experiences": count(*[_type=="experience"])
  }`);
  return result;
});