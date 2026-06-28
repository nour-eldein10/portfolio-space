# Play Store UI Implementation Plan

## Overview
We will completely redesign the marketplace layout and the detail pages for all project types (Apps, Projects, Designs) to match the Google Play Store UI as shown in the provided screenshots. We will also unify the detail pages so that Apps, Projects, and Designs all use a single, unified `DetailShell` and share the same "info details" fields (Rating, Reviews, Downloads, etc.) in Sanity CMS.

## Proposed Changes

### 1. Unified Sanity Schemas & CMS Queries
To allow putting "info details" for all created projects, we will:
- **`schemaTypes/project.ts` & `schemaTypes/design.ts`**: Add `rating`, `reviews`, `downloads`, `category`, and `tagline` fields to match the `app.ts` schema.
- **`src/lib/cms.ts`**: Update `projectsQuery` and `designsQuery` to fetch these new fields and return them uniformly.

### 2. Marketplace Grid UI (Image 1)
- **`src/routes/apps.tsx` (Marketplace)**: Redesign the item cards to match the Play Store horizontal/grid look.
  - Remove the tall poster layout (`aspect-[4/5]`) and replace it with a clean `aspect-square` squircle icon (`rounded-2xl` or `3xl`).
  - Render the title and rating directly below the icon.
  - Use a tighter grid (e.g., 5 to 7 columns on desktop) to match the dense "Recommended for you" style.

### 3. Unified Detail Page UI (Image 2)
- **`src/components/site/detail-shell.tsx`**: Completely overhaul the layout to mimic the Play Store Desktop UI.
  - **Header**: Flex layout. Left side will contain the Title, Company/Category, Rating + Reviews + Downloads stats, and a green "Install" / "Visit" button. Right side will contain a large squircle version of the cover image.
  - **Gallery**: Keep the horizontal scrolling MediaItem gallery just below the header.
  - **About section**: Render the description text below the gallery.
- **`src/routes/apps.$slug.tsx`**: Refactor this to use the new `<DetailShell>` component instead of its own custom layout.
- **`src/routes/projects.$slug.tsx` & `src/routes/designs.$slug.tsx`**: Pass the newly queried stats (rating, downloads, etc.) into the `<DetailShell>`.

## Open Questions
- What text should the main action button say for Projects and Designs? For Apps it says "Install", but for designs it might be "View Project" or "Open". We can make this dynamic or just use "View".

## Verification
- Review the marketplace to ensure it displays as a tight grid of squircle icons.
- Review an app detail page, a project detail page, and a design detail page to ensure they all share the exact same Play Store layout.
