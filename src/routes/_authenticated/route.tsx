import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let { data, error } = await supabase.auth.getUser();
    // Retry once after a short delay in case the session is still propagating
    if (error || !data.user) {
      await new Promise((r) => setTimeout(r, 500));
      ({ data, error } = await supabase.auth.getUser());
    }
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});