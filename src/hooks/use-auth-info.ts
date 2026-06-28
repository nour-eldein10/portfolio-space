import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export interface AuthInfo {
  loading: boolean;
  userId: string | null;
  isAdmin: boolean;
}

export function useAuthInfo(): AuthInfo {
  const [state, setState] = useState<AuthInfo>({ loading: true, userId: null, isAdmin: false });

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (cancelled) return;
      if (user) {
        // Assume logged in user is admin for portfolio
        setState({ loading: false, userId: user.uid, isAdmin: true });
      } else {
        setState({ loading: false, userId: null, isAdmin: false });
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return state;
}
