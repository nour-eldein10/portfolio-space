import { defineField, defineType } from "sanity";

export default defineType({
  name: "design",
  title: "Designs",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "rating", title: "Rating (0-5)", type: "number" }),
    defineField({ name: "reviews", title: "Reviews label", type: "string" }),
    defineField({ name: "downloads", title: "Downloads label", type: "string" }),
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
