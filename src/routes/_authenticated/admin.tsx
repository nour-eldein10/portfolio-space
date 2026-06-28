import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { checkIsAdmin } from "@/lib/reviews.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — nour.dev" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    try {
      const { isAdmin } = await checkIsAdmin();
      if (!isAdmin) return { isAdmin: false };
      return { isAdmin: true };
    } catch {
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin } = Route.useRouteContext();
  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center hairline rounded-3xl p-10 bg-surface/40">
          <h1 className="font-display text-2xl">Not an admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in, but you don't have admin access to this site.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Back to site</Link>
          </Button>
        </div>
      </main>
    );
  }
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
