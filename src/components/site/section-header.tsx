import type { ReactNode } from "react";

export function SectionHeader({
  index,
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-6 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
        <span className="text-[color:var(--neon)]">{index}</span>
        <span className="h-px w-8 bg-border" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display font-medium text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.025em] text-balance max-w-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}