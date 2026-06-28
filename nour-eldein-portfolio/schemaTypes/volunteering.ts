import { defineField, defineType } from "sanity";

export default defineType({
  name: "volunteering",
  title: "Volunteering",
  type: "document",
  fields: [
    defineField({ name: "organization", title: "Organization", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "period", title: "Period", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "achievements", title: "Achievements", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "responsibilities", title: "Responsibilities", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "image", title: "Image", type: "image" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
