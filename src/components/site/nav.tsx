import logo from "@/assets/logo.webp";
import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuthInfo } from "@/hooks/use-auth-info";
import { auth as firebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/services" as const, label: "Services" },
  { to: "/apps" as const, label: "Marketplace" },
  { to: "/about" as const, label: "About Me" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuthInfo();
  const router = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"
          }`}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div
            className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${scrolled ? "bg-surface/70 backdrop-blur-xl hairline" : "bg-transparent"
              }`}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full overflow-hidden ring-1 ring-[color:var(--neon)]/70 shadow-[0_0_28px_color-mix(in_oklab,var(--neon)_70%,transparent)] bg-background">
                <img src={logo} alt="Nour Eldein logo" className="h-full w-full object-contain" />
              </span>
              <span className="font-mono text-[15px] tracking-tight">
                nour<span className="text-muted-foreground">.dev</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 relative">
              {links.map((l) => {
                const isActive = router.location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`relative px-3.5 py-1.5 text-[13px] rounded-full transition-colors z-10 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-surface-2/60 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {l.label}
                  </Link>
                );
              })}
              {auth.isAdmin && (
                <Link
                  to="/admin"
                  className="px-3.5 py-1.5 text-[13px] text-[color:var(--neon)] hover:text-foreground rounded-full hover:bg-surface-2/60 transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                {auth.userId ? (
                  <button
                    onClick={() => signOut(firebaseAuth)}
                    className="text-[12px] text-muted-foreground hover:text-foreground"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="text-[12px] text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-[13px] font-medium hover:bg-[color:var(--amber)] transition-colors"
                  aria-label="Contact"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </Link>
              </div>
              <button
                aria-label="Toggle mobile menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden h-10 w-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-surface-2/60 hairline text-foreground"
              >
                <span
                  className={`h-px w-4 bg-current transition-all ${mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`}
                />
                <span
                  className={`h-px w-4 bg-current transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating CTA always visible on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 hidden md:block"
          >
            <Link
              to="/contact"
              className="group flex items-center justify-center h-14 w-14 rounded-full bg-[color:var(--neon)] text-background shadow-[0_0_30px_color-mix(in_oklab,var(--neon)_60%,transparent)] hover:scale-110 transition-transform"
            >
              <span className="font-mono text-xl group-hover:rotate-12 transition-transform">
                👋
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-40 bg-background/95 backdrop-blur-xl border-b hairline pt-28 pb-8 px-6 md:hidden shadow-2xl flex flex-col"
          >
            <nav className="flex flex-col gap-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display tracking-tight text-foreground/80 hover:text-[color:var(--amber)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              {auth.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display tracking-tight text-[color:var(--neon)]"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
            <div className="mt-8 pt-8 border-t hairline flex flex-col gap-4">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-4 py-3 text-sm font-medium"
              >
                <span className="h-2 w-2 rounded-full bg-[color:var(--neon)]" />
                Available for work
              </Link>
              {auth.userId ? (
                <button
                  onClick={() => {
                    signOut(firebaseAuth);
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm text-muted-foreground py-2"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-muted-foreground py-2 text-center"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
