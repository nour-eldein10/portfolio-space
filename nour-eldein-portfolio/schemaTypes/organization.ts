import { defineField, defineType } from "sanity";

export default defineType({
  name: "organization",
  title: "Organizations",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "type", title: "Type", type: "string", description: "e.g. Startup, Agency, Open Source" }),
    defineField({ name: "image", title: "Logo/Image", type: "image" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
