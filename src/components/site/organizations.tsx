import { organizations } from "@/lib/portfolio-data";
import { SectionHeader } from "./section-header";

export function Organizations() {
  const items = [...organizations, ...organizations];
  return (
    <section className="py-28 sm:py-36 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="04"
          eyebrow="Trusted by"
          title={
            <>
              Organizations &{" "}
              <span className="font-serif-italic text-[color:var(--amber)]">Teams.</span>
            </>
          }
          subtitle="Companies, teams and organizations I've worked with and contributed to."
        />
      </div>
      <div className="mt-14 border-y hairline overflow-hidden bg-surface/20">
        <div className="flex marquee-track whitespace-nowrap py-8">
          {items.map((org, i) => (
            <span key={i} className="group flex items-center gap-4 pr-14 cursor-default">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2/60 hairline font-display text-xl font-bold text-foreground/60 group-hover:text-foreground group-hover:bg-surface-2 group-hover:border-[color:var(--neon)]/40 transition-all duration-300">
                {org.name.charAt(0)}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-lg tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                  {org.name}
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  {org.type}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
