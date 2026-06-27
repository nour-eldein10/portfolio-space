import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skills } from "@/lib/portfolio-data";
import { SectionHeader } from "./section-header";

const categories = Object.keys(skills) as (keyof typeof skills)[];

const categoryIcons: Record<string, string> = {
  Development: "⚡",
  Design: "🎨",
  Automation: "⚙️",
  Marketing: "📈",
  Leadership: "🎯",
  "Soft Skills": "💡",
};

export function Skills() {
  const [active, setActive] = useState<keyof typeof skills>("Development");

  return (
    <section id="skills" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          index="06"
          eyebrow="What I know"
          title={
            <>
              Skills &{" "}
              <span className="font-serif-italic text-[color:var(--neon)]">
                expertise.
              </span>
            </>
          }
          subtitle="A multidisciplinary skillset built across development, design, automation and leadership."
        />

        {/* Category pills */}
        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                active === cat
                  ? "bg-foreground text-background"
                  : "hairline text-muted-foreground hover:text-foreground hover:bg-surface/60"
              }`}
            >
              <span>{categoryIcons[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Skill bars */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid sm:grid-cols-2 gap-4"
          >
            {skills[active].map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-5 rounded-2xl hairline bg-surface/30 hover:bg-surface/60 hover:-translate-y-0.5 hover:shadow-[0_0_20px_-8px_rgba(255,255,255,0.05)] transition-all duration-400"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm tracking-tight group-hover:text-foreground transition-colors">
                    {skill.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground/70 transition-colors">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-2/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        skill.level >= 85
                          ? "linear-gradient(90deg, var(--neon), color-mix(in oklab, var(--neon) 70%, white))"
                          : skill.level >= 70
                            ? "linear-gradient(90deg, var(--amber), color-mix(in oklab, var(--amber) 70%, white))"
                            : "var(--muted-foreground)",
                      boxShadow:
                        skill.level >= 85
                          ? "0 0 12px color-mix(in oklab, var(--neon) 40%, transparent)"
                          : skill.level >= 70
                            ? "0 0 12px color-mix(in oklab, var(--amber) 40%, transparent)"
                            : "none",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
