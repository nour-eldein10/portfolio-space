import { techStack } from "@/lib/portfolio-data";

export function Marquee() {
  const items = [...techStack, ...techStack];
  return (
    <section aria-hidden className="border-y hairline overflow-hidden bg-surface/40">
      <div className="flex marquee-track whitespace-nowrap py-6">
        {items.map((t, i) => (
          <span key={i} className="group flex items-center gap-3 pr-10 cursor-default">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2/60 hairline group-hover:scale-110 group-hover:bg-surface-2 transition-all duration-300 p-2.5">
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-current text-muted-foreground group-hover:text-foreground transition-colors duration-300"
              >
                <title>{t.name}</title>
                <path d={t.icon} />
              </svg>
            </span>
            <span
              className={`text-[clamp(1rem,2.5vw,1.4rem)] font-display tracking-tight group-hover:text-foreground transition-colors ${
                i % 3 === 0
                  ? "text-[color:var(--amber)]"
                  : i % 3 === 1
                    ? "text-foreground/70"
                    : "text-[color:var(--neon)]"
              }`}
            >
              {t.name}
            </span>
            <span className="text-muted-foreground/30 ml-4">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
