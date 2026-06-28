import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/lib/firebase";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let user = auth.currentUser;
    // Retry once after a short delay in case the session is still propagating
    if (!user) {
      await new Promise((r) => setTimeout(r, 500));
      user = auth.currentUser;
    }
    if (!user) {
      throw redirect({ to: "/auth" });
    }
    return { user };
  },
  component: () => <Outlet />,
});
