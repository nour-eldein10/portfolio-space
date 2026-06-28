import { Link } from "@tanstack/react-router";
import { SiteNav } from "./nav";
import { ContactFooter } from "./contact-footer";

export function DetailShell({
  eyebrow,
  title,
  meta,
  cover,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  cover?: string | null;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="relative">
      <SiteNav />
      <section className="pt-36 pb-12">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/"
            className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground"
          >
            ← back
          </Link>
          <p className="mt-8 font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            <span className="text-[color:var(--neon)]">●</span> {eyebrow}
          </p>
          <h1 className="mt-5 font-display font-medium text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
            {title}
          </h1>
          {meta && <p className="mt-4 font-mono text-xs text-muted-foreground">{meta}</p>}
        </div>
      </section>
      {cover && (
        <section className="pb-12">
          <div className="mx-auto max-w-5xl px-6">
            <div className="overflow-hidden rounded-3xl hairline">
              <img src={cover} alt={title} className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>
      )}
      {(body || children) && (
        <section className="pb-28">
          <div className="mx-auto max-w-3xl px-6">
            {body && (
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
                {body}
              </div>
            )}
            {children}
          </div>
        </section>
      )}
      <ContactFooter />
    </main>
  );
}
