import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "@tanstack/react-router";
import { type ReactNode, useState, useEffect } from "react";

/**
 * Page Transition wrapper — wraps <Outlet /> to add fade + slide
 * transitions between route navigations.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [routeKey, setRouteKey] = useState(router.state.location.pathname);

  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => {
      setRouteKey(router.state.location.pathname);
    });
    return unsub;
  }, [router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
