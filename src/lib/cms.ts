import { queryOptions } from "@tanstack/react-query";
import { sanityClient, urlFor } from "./sanity";
import { supabase } from "@/integrations/supabase/client";
import {
  profile as profileFallback,
  stats as statsFallback,
  services as servicesFallback,
  featuredProjects as projectsFallback,
  apps as appsFallback,
  designs as designsFallback,
  experiences as experiencesFallback,
  reviews as reviewsFallback,
  organizations as organizationsFallback,
  volunteering as volunteeringFallback,
  certificates as certificatesFallback,
} from "./portfolio-data";
import appPulse from "@/assets/app-pulse.jpg";
import appLedger from "@/assets/app-ledger.jpg";
import appStill from "@/assets/app-still.jpg";
import design1 from "@/assets/design-1.jpg";
import design2 from "@/assets/design-2.jpg";
import design3 from "@/assets/design-3.jpg";
import portrait from "@/assets/portrait.jpg";

// Fallback local images keyed by slug/title
const imageFallback: Record<string, string> = {
  pulse: appPulse,
  ledger: appLedger,
  still: appStill,
  "halftone-identity-system": design1,
  "spectra-editorial-spread": design2,
  "lanture-logo-suite": design3,
};

function resolveImage(source: unknown, fallbackKey: string, defaultUrl: string): string {
  if (source && typeof source === "object" && "asset" in (source as object)) {
    try {
      return urlFor(source as Parameters<typeof urlFor>[0])
        .width(1200)
        .url();
    } catch {
      /* noop */
    }
  }
  return imageFallback[fallbackKey] ?? defaultUrl;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ───────── Profile ───────── */

export const profileQuery = queryOptions({
  queryKey: ["cms", "profile"],
  queryFn: async () => {
    const doc = await sanityClient.fetch<{
      name?: string;
      handle?: string;
      location?: string;
      email?: string;
      primaryRole?: string;
      rotatingRoles?: string[];
      bio?: string;
      available?: boolean;
      portrait?: unknown;
    } | null>(`*[_type=="profile"][0]`);
    if (!doc) return profileFallback;
    return {
      ...profileFallback,
      name: doc.name ?? profileFallback.name,
      handle: doc.handle ?? profileFallback.handle,
      location: doc.location ?? profileFallback.location,
      email: doc.email ?? profileFallback.email,
      primaryRole: doc.primaryRole ?? profileFallback.primaryRole,
      rotatingRoles:
        doc.rotatingRoles && doc.rotatingRoles.length
          ? doc.rotatingRoles
          : profileFallback.rotatingRoles,
      bio: doc.bio ?? profileFallback.bio,
      available: doc.available ?? profileFallback.available,
      portrait: resolveImage(doc.portrait, "portrait", portrait),
    };
  },
  initialData: profileFallback,
  staleTime: 0,
});

/* ───────── Stats ───────── */

export const statsQuery = queryOptions({
  queryKey: ["cms", "stats"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      { label: string; value: string | number; order?: number }[]
    >(`*[_type=="stat"] | order(order asc){ label, value, order }`);
    if (!docs?.length) return statsFallback;
    return docs.map((d) => ({
      label: d.label,
      value: typeof d.value === "string" && /^\d+$/.test(d.value) ? Number(d.value) : d.value,
    }));
  },
  initialData: statsFallback,
  staleTime: 0,
});

/* ───────── Services ───────── */

export const servicesQuery = queryOptions({
  queryKey: ["cms", "services"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      {
        n: string;
        title: string;
        body: string;
        tags?: string[];
        order?: number;
      }[]
    >(`*[_type=="service"] | order(order asc){ n, title, body, tags, order }`);
    if (!docs?.length) return servicesFallback;
    return docs.map((d) => ({
      n: d.n,
      title: d.title,
      body: d.body,
      tags: d.tags ?? [],
    }));
  },
  initialData: servicesFallback,
  staleTime: 0,
});

/* ───────── Featured projects ───────── */

export const projectsQuery = queryOptions({
  queryKey: ["cms", "projects"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      {
        name: string;
        slug?: { current?: string };
        year?: number;
        role?: string;
        summary?: string;
        accent?: "neon" | "amber";
        cover?: unknown;
        order?: number;
      }[]
    >(
      `*[_type=="project"] | order(order asc){ name, slug, year, role, summary, accent, cover, order }`,
    );
    if (!docs?.length) return projectsFallback;
    return docs.map((d, i) => {
      const id = d.slug?.current ?? slugify(d.name);
      return {
        id,
        name: d.name,
        year: d.year ?? new Date().getFullYear(),
        role: d.role ?? "",
        summary: d.summary ?? "",
        accent: (d.accent ?? "neon") as "neon" | "amber",
        cover: resolveImage(d.cover, id, projectsFallback[i % projectsFallback.length].cover),
      };
    });
  },
  initialData: projectsFallback,
  staleTime: 0,
});

/* ───────── Apps ───────── */

export const appsQuery = queryOptions({
  queryKey: ["cms", "apps"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      {
        name: string;
        slug?: { current?: string };
        tagline?: string;
        icon?: string;
        rating?: number;
        reviews?: string;
        downloads?: string;
        category?: string;
        accent?: "neon" | "amber";
        cover?: unknown;
        order?: number;
      }[]
    >(
      `*[_type=="app"] | order(order asc){ name, slug, tagline, icon, rating, reviews, downloads, category, accent, cover, order }`,
    );
    if (!docs?.length) return appsFallback;
    return docs.map((d, i) => {
      const id = d.slug?.current ?? slugify(d.name);
      return {
        id,
        name: d.name,
        tagline: d.tagline ?? "",
        icon: d.icon ?? "◆",
        rating: d.rating ?? 0,
        reviews: d.reviews ?? "0",
        downloads: d.downloads ?? "—",
        category: d.category ?? "",
        accent: (d.accent ?? "neon") as "neon" | "amber",
        cover: resolveImage(d.cover, id, appsFallback[i % appsFallback.length].cover),
      };
    });
  },
  initialData: appsFallback,
  staleTime: 0,
});

/* ───────── Designs ───────── */

export const designsQuery = queryOptions({
  queryKey: ["cms", "designs"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      { title: string; category?: string; cover?: unknown; order?: number }[]
    >(`*[_type=="design"] | order(order asc){ title, category, cover, order }`);
    if (!docs?.length) return designsFallback;
    return docs.map((d, i) => {
      const id = slugify(d.title);
      return {
        id,
        title: d.title,
        category: d.category ?? "",
        cover: resolveImage(d.cover, id, designsFallback[i % designsFallback.length].cover),
      };
    });
  },
  initialData: designsFallback,
  staleTime: 0,
});

/* ───────── Experiences ───────── */

export const experiencesQuery = queryOptions({
  queryKey: ["cms", "experiences"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      {
        role: string;
        company: string;
        period?: string;
        location?: string;
        highlights?: string[];
        order?: number;
      }[]
    >(
      `*[_type=="experience"] | order(order asc){ role, company, period, location, highlights, order }`,
    );
    if (!docs?.length) return experiencesFallback;
    return docs.map((d) => ({
      role: d.role,
      company: d.company,
      period: d.period ?? "",
      location: d.location ?? "",
      highlights: d.highlights ?? [],
    }));
  },
  initialData: experiencesFallback,
  staleTime: 0,
});
/* ───────── Organizations ───────── */

export const organizationsQuery = queryOptions({
  queryKey: ["cms", "organizations"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      { name: string; type: string; image?: unknown; order?: number }[]
    >(`*[_type=="organization"] | order(order asc){ name, type, image, order }`);
    if (!docs?.length) return organizationsFallback;
    return docs.map((d) => ({
      name: d.name,
      type: d.type ?? "",
      image: d.image && typeof d.image === "object" && "asset" in (d.image as object)
        ? urlFor(d.image as Parameters<typeof urlFor>[0]).width(200).url()
        : null,
    }));
  },
  initialData: organizationsFallback,
  staleTime: 0,
});

/* ───────── Volunteering ───────── */

export const volunteeringQuery = queryOptions({
  queryKey: ["cms", "volunteering"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      {
        organization: string;
        role: string;
        period?: string;
        description?: string;
        achievements?: string[];
        responsibilities?: string[];
        image?: unknown;
        order?: number;
      }[]
    >(
      `*[_type=="volunteering"] | order(order asc){ organization, role, period, description, achievements, responsibilities, image, order }`,
    );
    if (!docs?.length) return volunteeringFallback;
    return docs.map((d, i) => {
      const id = `vol-${i}`;
      return {
        id,
        organization: d.organization,
        role: d.role,
        period: d.period ?? "",
        description: d.description ?? "",
        achievements: d.achievements ?? [],
        responsibilities: d.responsibilities ?? [],
        image: d.image && typeof d.image === "object" && "asset" in (d.image as object)
          ? urlFor(d.image as Parameters<typeof urlFor>[0]).width(400).url()
          : null,
      };
    });
  },
  initialData: volunteeringFallback,
  staleTime: 0,
});

/* ───────── Certificates ───────── */

export const certificatesQuery = queryOptions({
  queryKey: ["cms", "certificates"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      {
        title: string;
        issuer: string;
        date?: string;
        image?: unknown;
        order?: number;
      }[]
    >(`*[_type=="certificate"] | order(order asc){ title, issuer, date, image, order }`);
    if (!docs?.length) return certificatesFallback;
    return docs.map((d, i) => {
      const id = `cert-${i}`;
      return {
        id,
        title: d.title,
        issuer: d.issuer ?? "",
        date: d.date ?? "",
        image: d.image && typeof d.image === "object" && "asset" in (d.image as object)
          ? urlFor(d.image as Parameters<typeof urlFor>[0]).width(800).url()
          : certificatesFallback[i % certificatesFallback.length].image, // local fallback logic
      };
    });
  },
  initialData: certificatesFallback,
  staleTime: 0,
});

/* ───────── Reviews ───────── */

export const reviewsQuery = queryOptions({
  queryKey: ["public", "reviews"],
  queryFn: async () => {
    const docs = await sanityClient.fetch<
      { quote: string; author: string; role?: string | null; avatar?: unknown }[]
    >(
      `*[_type == "review" && status == "approved"] | order(createdAt desc)[0...12]{
        quote, author, role, avatar
      }`,
    );
    if (!docs?.length) return reviewsFallback;
    return docs.map((d) => ({
      quote: d.quote,
      author: d.author,
      role: d.role ?? "",
      avatar:
        d.avatar && typeof d.avatar === "object" && "asset" in (d.avatar as object)
          ? urlFor(d.avatar as Parameters<typeof urlFor>[0])
              .width(120)
              .height(120)
              .url()
          : null,
    }));
  },
  initialData: reviewsFallback,
  staleTime: 30_000,
});

/**
 * Live stats: app/project/design counts from Sanity + profile "years building".
 * Computed entirely on the client via the public Sanity CDN read.
 */
export const liveStatsQuery = queryOptions({
  queryKey: ["public", "stats", "live"],
  queryFn: async () => {
    const result = await sanityClient.fetch<{
      apps: number;
      projects: number;
      designs: number;
      experiences: number;
      yearsBuilding?: number;
      automationFlows?: number;
    }>(`{
      "apps": count(*[_type=="app"]),
      "projects": count(*[_type=="project"]),
      "designs": count(*[_type=="design"]),
      "experiences": count(*[_type=="experience"]),
      "yearsBuilding": *[_type=="profile"][0].yearsBuilding,
      "automationFlows": *[_type=="profile"][0].automationFlows
    }`);
    return [
      { label: "Apps shipped", value: result.apps },
      { label: "Projects", value: result.projects },
      { label: "Designs", value: result.designs },
      { label: "Years building", value: result.yearsBuilding ?? 6 },
    ];
  },
  initialData: statsFallback,
  staleTime: 0,
});
