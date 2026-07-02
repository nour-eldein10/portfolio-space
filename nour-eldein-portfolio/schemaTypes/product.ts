import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "rating", title: "Rating (0-5)", type: "number" }),
    defineField({ name: "reviews", title: "Reviews label", type: "string" }),
    defineField({ name: "downloads", title: "Downloads label", type: "string" }),
    defineField({
      name: "accent",
      title: "Accent",
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
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
