import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/lib/cms";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { Experience } from "@/components/site/experience";
import { Skills } from "@/components/site/skills";
import { Volunteering } from "@/components/site/volunteering";
import { Certificates } from "@/components/site/certificates";
import { motion } from "motion/react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Me — Nour Eldein Ahmed" },
      {
        name: "description",
        content: "The story, skills, and experience behind the software studio.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: profile } = useQuery(profileQuery);

  return (
    <main className="relative bg-background">
      <SiteNav />

      {/* Hero section */}
      <section className="relative pt-44 pb-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(40% 40% at 80% 20%, color-mix(in oklab, var(--neon) 22%, transparent), transparent 70%), radial-gradient(35% 35% at 20% 80%, color-mix(in oklab, var(--amber) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-[1.5fr_1fr] gap-16 items-center">
          <div>
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-[color:var(--neon)]">
              ● The Story
            </p>
            <h1 className="mt-6 font-display font-medium text-[clamp(2.4rem,7vw,5rem)] leading-[0.95] tracking-[-0.035em] text-balance">
              Half engineer,{" "}
              <span className="font-serif-italic text-[color:var(--amber)]">half designer.</span>
            </h1>
            <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-muted-foreground max-w-2xl text-pretty">
              <p>
                My journey didn't start with a traditional computer science degree. It started with
                a desire to build things that look good and work seamlessly. Over the past 6 years,
                I've transitioned from graphic design to mobile app development, and eventually into
                automation and product engineering.
              </p>
              <p>
                I believe the best products come from a single cohesive vision. By bridging the gap
                between design and code, I eliminate handoffs and ensure the final product matches
                the original intent perfectly.
              </p>
              <p>
                Whether I'm writing Flutter UI, configuring n8n automation workflows, or designing
                brand identities in Figma, my goal remains the same: building systems that help
                businesses grow and innovate.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden hairline hidden md:block"
          >
            <div className="absolute inset-0 bg-[color:var(--neon)]/10 mix-blend-overlay z-10" />
            <img
              src={profile.portrait}
              alt={profile.name}
              className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Reusing existing sections for the About Page */}
      <Skills />
      <Experience />
      <Certificates />
      <Volunteering />

      {/* Education & Courses snippet */}
      <section className="py-28 bg-surface/20 border-t hairline">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <h3 className="font-display text-3xl mb-8 flex items-center gap-4">
                Education
                <span className="h-px flex-1 bg-border" />
              </h3>
              <div className="relative pl-8 border-l hairline space-y-10">
                <div className="relative">
                  <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full bg-[color:var(--neon)] ring-4 ring-background" />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    2020 — 2024
                  </span>
                  <h4 className="font-display text-xl mt-1">Bachelor of Computer Science</h4>
                  <p className="text-sm text-foreground/70 mt-1">Mansoura University</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-display text-3xl mb-8 flex items-center gap-4">
                Selected Courses
                <span className="h-px flex-1 bg-border" />
              </h3>
              <ul className="space-y-4">
                {[
                  "Flutter Advanced UI & Clean Architecture",
                  "Python Automation & Web Scraping",
                  "Google UX Design Professional Certificate",
                  "Advanced Growth Strategy & Product Marketing",
                ].map((course, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl hairline bg-surface/30"
                  >
                    <span className="text-sm">{course}</span>
                    <span className="text-[color:var(--neon)] text-xs">✓</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}
