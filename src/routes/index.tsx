import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Products } from "@/components/site/products";
import { Organizations } from "@/components/site/organizations";
import { Experience } from "@/components/site/experience";
import { Skills } from "@/components/site/skills";
import { Reviews } from "@/components/site/reviews";
import { Certificates } from "@/components/site/certificates";
import { Volunteering } from "@/components/site/volunteering";
import { ContactFooter } from "@/components/site/contact-footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SectionReveal } from "@/components/site/section-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nour Eldein Ahmed — Premium Personal Brand Platform" },
      {
        name: "description",
        content:
          "Portfolio of Nour Eldein Ahmed — Software Studio, Personal Brand, App Marketplace, Design Showcase, Service Platform.",
      },
      {
        property: "og:title",
        content: "Nour Eldein Ahmed — Premium Personal Brand Platform",
      },
      {
        property: "og:description",
        content:
          "Software Studio, Personal Brand, App Marketplace, Design Showcase, Service Platform.",
      },
    ],
  }),
  component: Index,
});

function Divider() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="w-full h-px bg-border/40" />
    </div>
  );
}

function Index() {
  return (
    <main className="relative">
      <ScrollProgress />
      <SiteNav />
      <Hero />
      <Marquee />
      <Divider />
      <SectionReveal>
        <Products />
      </SectionReveal>
      <Divider />
      <Organizations />
      <Divider />
      <SectionReveal>
        <Experience />
      </SectionReveal>
      <Divider />
      <Skills />
      <Divider />
      <Reviews />
      <Divider />
      <Certificates />
      <Divider />
      <SectionReveal>
        <Volunteering />
      </SectionReveal>
      <ContactFooter />
    </main>
  );
}
