import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nour Eldein Ahmed" },
      {
        name: "description",
        content: "Start a mobile app, an automation, or a brand. Booking Q1 2026 from Mansoura.",
      },
      { property: "og:title", content: "Contact — Nour Eldein Ahmed" },
      {
        property: "og:description",
        content: "Start a mobile app, an automation, or a brand. Booking Q1 2026 from Mansoura.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-32" />
      <ContactFooter />
    </main>
  );
}
