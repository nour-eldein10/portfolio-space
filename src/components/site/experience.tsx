import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  workExperience,
  volunteerExperience,
  internships,
  leadership,
} from "@/lib/portfolio-data";
import { SectionHeader } from "./section-header";

const tabs = [
  { key: "work", label: "Work Experience", data: workExperience },
  { key: "volunteer", label: "Volunteer Work", data: volunteerExperience },
  { key: "internships", label: "Internships", data: internships },
  { key: "leadership", label: "Leadership", data: leadership },
] as const;

export function Experience() {
  const [activeTab, setActiveTab] = useState("work");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const currentTab = tabs.find((t) => t.key === activeTab) ?? tabs[0];

  return (
    <section id="experience" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_1.4fr] gap-16">
        <div className="lg:sticky lg:top-32 self-start">
          <SectionHeader
            index="05"
            eyebrow="Where I've worked"
            title={
              <>
                Roles that shaped{" "}
                <span className="font-serif-italic text-[color:var(--amber)]">
                  how I build.
                </span>
              </>
            }
            subtitle="Freelance, startups, and self-led products. Each one added a new skill to the stack."
          />

          {/* Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setExpandedIdx(null);
                }}
                className={`relative px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-foreground text-background"
                    : "hairline text-muted-foreground hover:text-foreground hover:bg-surface/60"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.span
                    layoutId="exp-tab-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 h-1 w-1 rounded-full bg-[color:var(--neon)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.ol
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <span className="absolute left-3 top-2 bottom-2 w-px bg-border" />
            {currentTab.data.map((exp, i) => (
              <motion.li
                key={exp.company + exp.period}
                initial={{ opacity: 0, x: 40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  delay: Math.min(i * 0.1, 0.5),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative pl-12 pb-12 last:pb-0 cursor-pointer group"
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              >
                {/* Progress dot */}
                <span
                  className={`absolute left-1.5 top-1.5 h-3 w-3 rounded-full ring-4 ring-background transition-colors ${
                    expandedIdx === i
                      ? "bg-[color:var(--amber)]"
                      : "bg-[color:var(--neon)]"
                  }`}
                />
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  {exp.period} · {exp.location}
                </p>
                <h3 className="mt-2 font-display text-2xl tracking-tight group-hover:text-[color:var(--neon)] transition-colors">
                  {exp.role}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {exp.company}
                </p>
                <AnimatePresence>
                  {(expandedIdx === i || expandedIdx === null) && (
                    <motion.ul
                      initial={expandedIdx === i ? { height: 0, opacity: 0 } : false}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-1.5 overflow-hidden"
                    >
                      {exp.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-[15px] text-foreground/80"
                        >
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-[color:var(--amber)] shrink-0" />
                          {h}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </section>
  );
}
