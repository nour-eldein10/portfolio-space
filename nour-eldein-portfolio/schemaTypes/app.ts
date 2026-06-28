import { defineField, defineType } from "sanity";

export default defineType({
  name: "app",
  title: "Apps",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "icon", title: "Icon character", type: "string" }),
    defineField({ name: "rating", title: "Rating (0-5)", type: "number" }),
    defineField({ name: "reviews", title: "Reviews label", type: "string" }),
    defineField({ name: "downloads", title: "Downloads label", type: "string" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({
      name: "accent",
      title: "Accent",
      type: "string",
      options: { list: ["neon", "amber"] },
    }),
    defineField({ name: "cover", title: "Cover image", type: "image" }),
    defineField({
      name: "gallery",
      title: "Gallery URLs",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
