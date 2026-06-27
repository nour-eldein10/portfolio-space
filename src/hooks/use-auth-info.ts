import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AuthInfo {
  loading: boolean;
  userId: string | null;
  isAdmin: boolean;
}

export function useAuthInfo(): AuthInfo {
  const [state, setState] = useState<AuthInfo>({ loading: true, userId: null, isAdmin: false });

  useEffect(() => {
    let cancelled = false;

    async function load(userId: string | null) {
      if (!userId) {
        if (!cancelled) setState({ loading: false, userId: null, isAdmin: false });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) setState({ loading: false, userId, isAdmin: !!data });
    }

    supabase.auth.getUser().then(({ data }) => load(data.user?.id ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => {
      load(s?.user?.id ?? null);
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}