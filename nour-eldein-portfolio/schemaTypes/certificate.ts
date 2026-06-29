import { defineField, defineType } from "sanity";

export default defineType({
    name: "certificate",
    title: "Certificates",
    type: "document",
    fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "issuer", title: "Issuer", type: "string" }),
        defineField({ name: "date", title: "Date", type: "string" }),
        defineField({ name: "image", title: "Image", type: "image" }),
        defineField({ name: "order", title: "Order", type: "number" }),
    ],
});
