import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Services } from "@/components/site/services";
import { Experience } from "@/components/site/experience";
import { ContactFooter } from "@/components/site/contact-footer";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Nour Eldein Ahmed" },
      {
        name: "description",
        content:
          "Mobile development, automation engineering, brand design and growth — one studio of one.",
      },
      { property: "og:title", content: "Services — Nour Eldein Ahmed" },
      {
        property: "og:description",
        content:
          "Mobile development, automation engineering, brand design and growth — one studio of one.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <main className="relative">
      <SiteNav />
      <section className="relative pt-44 pb-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            <span className="text-[color:var(--neon)]">●</span> Services
          </p>
          <h1 className="mt-6 font-display font-medium text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.035em] max-w-4xl">
            What I do, and how we'd{" "}
            <span className="font-serif-italic text-[color:var(--amber)]">work together.</span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-2 py-2 text-sm font-medium hover:bg-[color:var(--amber)] transition-colors"
            >
              Start a project
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground group-hover:rotate-45 transition-transform">
                →
              </span>
            </Link>
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 rounded-full hairline px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-[color:var(--neon)] transition-colors"
            >
              See the marketplace
            </Link>
          </div>
        </div>
      </section>
      <Services />
      <Experience />
      <ContactFooter />
    </main>
  );
}
