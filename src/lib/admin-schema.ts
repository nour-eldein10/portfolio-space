/**
 * Schema config that drives the generic admin CRUD page.
 * Each entry maps to a Sanity content type.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "tags"
  | "image"
  | "highlights"
  | "select"
  | "medialist"
  | "markdown";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: string[]; // for select
  helper?: string;
}

export interface TypeDef {
  type: string; // sanity _type
  label: string; // plural label "Services"
  singular: string; // "Service"
  titleField: string; // used for list display
  subtitleField?: string;
  imageField?: string; // for thumbnail
  fields: FieldDef[];
  singleton?: boolean; // profile = single doc
  singletonId?: string; // fixed _id for the one doc
}

export const TYPES: Record<string, TypeDef> = {
  profile: {
    type: "profile",
    label: "Profile",
    singular: "Profile",
    titleField: "name",
    singleton: true,
    singletonId: "profile-singleton",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "handle", label: "Handle", kind: "text" },
      { name: "location", label: "Location", kind: "text" },
      { name: "email", label: "Email", kind: "text" },
      { name: "primaryRole", label: "Primary role", kind: "text" },
      { name: "rotatingRoles", label: "Rotating roles", kind: "tags", helper: "Comma-separated" },
      { name: "bio", label: "Bio", kind: "textarea" },
      { name: "available", label: "Available for work", kind: "boolean" },
      { name: "portrait", label: "Portrait", kind: "image" },
    ],
  },
  service: {
    type: "service",
    label: "Services",
    singular: "Service",
    titleField: "title",
    subtitleField: "body",
    fields: [
      { name: "n", label: "Number (01, 02…)", kind: "text" },
      { name: "title", label: "Title", kind: "text" },
      { name: "body", label: "Body", kind: "textarea" },
      { name: "tags", label: "Tags", kind: "tags" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  experience: {
    type: "experience",
    label: "Experience",
    singular: "Experience entry",
    titleField: "role",
    subtitleField: "company",
    fields: [
      { name: "role", label: "Role", kind: "text" },
      { name: "company", label: "Company", kind: "text" },
      { name: "period", label: "Period", kind: "text", helper: "e.g. 2024 — Present" },
      { name: "location", label: "Location", kind: "text" },
      { name: "highlights", label: "Highlights", kind: "highlights", helper: "One per line" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  product: {
    type: "product",
    label: "Products",
    singular: "Product",
    titleField: "name",
    subtitleField: "summary",
    imageField: "cover",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      {
        name: "slug",
        label: "Slug",
        kind: "text",
        helper: "URL slug, lowercase-hyphens",
        required: true,
      },
      { name: "year", label: "Year", kind: "number" },
      { name: "role", label: "Role", kind: "text" },
      { name: "summary", label: "Short summary", kind: "textarea" },
      { name: "description", label: "Long description", kind: "textarea" },
      { name: "accent", label: "Accent", kind: "select", options: ["neon", "amber"] },
      { name: "cover", label: "Cover image", kind: "image" },
      { name: "content", label: "Rich Content (Markdown)", kind: "markdown" },
      { name: "gallery", label: "Media Gallery URLs", kind: "medialist", helper: "One URL per line" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  app: {
    type: "app",
    label: "Apps",
    singular: "App",
    titleField: "name",
    subtitleField: "tagline",
    imageField: "cover",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "slug", label: "Slug", kind: "text" },
      { name: "tagline", label: "Tagline", kind: "text" },
      { name: "description", label: "Short Description", kind: "textarea" },
      { name: "icon", label: "Icon character", kind: "text", helper: "Single glyph e.g. ◐" },
      { name: "rating", label: "Rating (0-5)", kind: "number" },
      { name: "reviews", label: "Reviews label", kind: "text", helper: "e.g. 2.1k" },
      { name: "downloads", label: "Downloads label", kind: "text", helper: "e.g. 120k+" },
      { name: "category", label: "Category", kind: "text" },
      { name: "accent", label: "Accent", kind: "select", options: ["neon", "amber"] },
      { name: "cover", label: "Cover image", kind: "image" },
      { name: "content", label: "Rich Content (Markdown)", kind: "markdown" },
      { name: "gallery", label: "Media Gallery URLs", kind: "medialist", helper: "One URL per line (.mp4, youtube, images)" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  design: {
    type: "design",
    label: "Designs",
    singular: "Design",
    titleField: "title",
    subtitleField: "category",
    imageField: "cover",
    fields: [
      { name: "title", label: "Title", kind: "text" },
      {
        name: "slug",
        label: "Slug",
        kind: "text",
        helper: "URL slug, lowercase-hyphens",
        required: true,
      },
      { name: "category", label: "Category", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "cover", label: "Cover image", kind: "image" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  organization: {
    type: "organization",
    label: "Organizations",
    singular: "Organization",
    titleField: "name",
    subtitleField: "type",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "type", label: "Type", kind: "text", helper: "e.g. Startup, Agency, Open Source" },
      { name: "image", label: "Logo/Image", kind: "image" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  volunteering: {
    type: "volunteering",
    label: "Volunteering",
    singular: "Volunteering entry",
    titleField: "role",
    subtitleField: "organization",
    imageField: "image",
    fields: [
      { name: "organization", label: "Organization", kind: "text" },
      { name: "role", label: "Role", kind: "text" },
      { name: "period", label: "Period", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "achievements", label: "Achievements", kind: "highlights" },
      { name: "responsibilities", label: "Responsibilities", kind: "highlights" },
      { name: "image", label: "Image", kind: "image" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  certificate: {
    type: "certificate",
    label: "Certificates",
    singular: "Certificate",
    titleField: "title",
    subtitleField: "issuer",
    imageField: "image",
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "issuer", label: "Issuer", kind: "text" },
      { name: "date", label: "Date", kind: "text" },
      { name: "image", label: "Image", kind: "image" },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
};
