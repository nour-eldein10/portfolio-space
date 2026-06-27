import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

/** Submit a new review. User must be signed in. Inserts as pending. */
export const submitReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { author: string; role?: string; quote: string }) => data)
  .handler(async ({ data, context }) => {
    const { error, data: inserted } = await context.supabase
      .from("reviews")
      .insert({
        user_id: context.userId,
        author: data.author.slice(0, 100),
        role: data.role?.slice(0, 100) ?? null,
        quote: data.quote.slice(0, 800),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });

/** Admin: list all reviews by status. */
export const adminListReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { status?: "pending" | "approved" | "rejected" }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const query = context.supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: rows, error } = data.status
      ? await query.eq("status", data.status)
      : await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

/** Admin: change a review status. */
export const adminSetReviewStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; status: "pending" | "approved" | "rejected" }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("reviews")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin: delete a review. */
export const adminDeleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Server fn that reports whether the current user is an admin. */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });