import { defineField, defineType } from "sanity";

export default defineType({
  name: "app",
  title: "Apps",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Short Description", type: "text" }),
    defineField({ name: "icon", title: "Icon character", type: "string" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "rating", title: "Rating (0–5)", type: "number" }),
    defineField({ name: "reviews", title: "Reviews Count (e.g. 2.1k)", type: "string" }),
    defineField({ name: "downloads", title: "Downloads / Installs (e.g. 120k+)", type: "string" }),
    defineField({
      name: "accent",
      title: "Accent Color",
      type: "string",
      options: { list: ["neon", "amber"] },
    }),
    defineField({ name: "cover", title: "Cover image", type: "image" }),
    defineField({ name: "features", title: "Features (Title: Description)", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "technologies", title: "Technologies", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "demoUrl", title: "Demo URL", type: "url" }),
    defineField({ name: "purchaseUrl", title: "Purchase URL", type: "url" }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({
      name: "gallery",
      title: "Gallery URLs",
      description: "Screenshots or video URLs shown in the media gallery",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
