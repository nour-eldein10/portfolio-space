import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Apps } from "@/components/site/apps";
import { Products } from "@/components/site/products";
import { Organizations } from "@/components/site/organizations";
import { Experience } from "@/components/site/experience";
import { Skills } from "@/components/site/skills";
import { Reviews } from "@/components/site/reviews";
import { Certificates } from "@/components/site/certificates";
import { Volunteering } from "@/components/site/volunteering";
import { ContactFooter } from "@/components/site/contact-footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nour Eldein Ahmed — Premium Personal Brand Platform" },
      {
        name: "description",
        content:
          "Portfolio of Nour Eldein Ahmed — Software Studio, Personal Brand, App Marketplace, Design Showcase, Service Platform.",
      },
      { property: "og:title", content: "Nour Eldein Ahmed — Premium Personal Brand Platform" },
      {
        property: "og:description",
        content: "Software Studio, Personal Brand, App Marketplace, Design Showcase, Service Platform.",
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
      <Reveal variant="fade-up" margin="-20px">
        <Marquee />
      </Reveal>
      <Divider />
      <Reveal variant="blur" duration={0.7}>
        <Products />
      </Reveal>
      <Divider />
      <Reveal variant="scale" duration={0.6}>
        <Apps />
      </Reveal>
      <Divider />
      <Reveal variant="fade-up">
        <Organizations />
      </Reveal>
      <Divider />
      <Reveal variant="fade-left" duration={0.65}>
        <Experience />
      </Reveal>
      <Divider />
      <Reveal variant="blur" duration={0.55}>
        <Skills />
      </Reveal>
      <Divider />
      <Reveal variant="jump" duration={0.7}>
        <Reviews />
      </Reveal>
      <Divider />
      <Reveal variant="scale" duration={0.6}>
        <Certificates />
      </Reveal>
      <Divider />
      <Reveal variant="fade-right" duration={0.65}>
        <Volunteering />
      </Reveal>
      <ContactFooter />
    </main>
  );
}
