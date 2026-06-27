## Goal

Replace the need for `noureldein-portfolio.sanity.studio` with an admin dashboard built into your own site at `/admin`. You sign in with email/password or Google, get promoted to admin, and from there manage everything that appears on the public site. Reviews and stats stop being hand-edited content and become live data driven by real activity.

## Stack decisions

- **Sanity stays** as the CMS for content you author: profile, services, experiences, projects, apps, designs. Your admin UI talks to Sanity through server functions that hold a write token. The 7-day worry is unfounded — Sanity free tier is permanent.
- **Lovable Cloud is added** for: auth (email + Google), the `user_roles` table that grants you admin, the `reviews` table (public submissions + moderation), and computed stats.
- **No more dependence on Sanity Studio**, ever. You only need to log into sanity.io once to mint a write token.

## Auth model

- Email/password + Google sign-in via Lovable Cloud.
- `app_role` enum (`admin`, `user`) and `user_roles` table (separate from profiles — never store roles on profiles).
- `has_role(uuid, app_role)` SECURITY DEFINER function used in all RLS policies.
- First-time setup: you sign up → I run a one-time migration that grants your `auth.users.id` the `admin` role.
- `/admin/*` lives under `_authenticated/` and additionally checks `has_role(uid, 'admin')`; non-admins get redirected to `/`.

## Sanity write path (token never touches browser)

1. You generate a write token in sanity.io/manage → API → Tokens (Editor role).
2. I prompt you to paste it as the `SANITY_WRITE_TOKEN` secret.
3. Server functions (`src/lib/admin-sanity.functions.ts`) use a server-only Sanity client with that token to read/write/upload assets. All admin mutations go through these functions, gated by `requireSupabaseAuth` + `has_role('admin')`.
4. The public site keeps using the existing CDN-cached read client — no change.

## Public-site changes

- **Marketplace** (`/apps`) and the existing Projects + Designs sections get **detail pages**:
  - `/apps/$slug`, `/projects/$slug`, `/designs/$slug`
  - Each loads its Sanity doc, renders gallery + long description, and has its own `head()` metadata (title, description, og:image from the cover).
  - The home cards link to these detail pages instead of being static.
- **Experiences** stays as the timeline on the home page, but now reads from the live Sanity data you control from `/admin`.
- **Reviews** section becomes:
  - A public form ("Leave a review") visible to signed-in visitors.
  - Reviews are stored in Lovable Cloud `reviews` table with `status: pending|approved|rejected`.
  - Only `approved` rows render publicly.
  - The home-page reviews section subscribes via Supabase realtime so new approvals appear without refresh.
- **Stats** become computed live: "Apps shipped" = `count(apps)`, "Projects" = `count(projects)`, "Designs" = `count(designs)`, "Years building" stays as a profile field (the only stat you'd ever want to override manually). The home stats strip reads these counts via a server function + realtime invalidates when admin changes content.

## Admin dashboard layout (`/admin`)

Shadcn sidebar layout. Sections:

1. **Overview** — quick counts, pending reviews badge, last-edited content.
2. **Profile** — single doc, edit-only form (name, handle, bio, roles, portrait upload, available toggle).
3. **Services** — full CRUD list + form (n, title, body, tags, order).
4. **Experiences** — full CRUD timeline editor (role, company, period, location, highlights[], order). Reordering with up/down buttons.
5. **Projects** — full CRUD with cover upload, gallery, long description, accent, slug, year, role, summary.
6. **Apps** — full CRUD with cover upload, icon, rating, reviews count, downloads, category, accent, long description, screenshots.
7. **Designs** — full CRUD with cover + gallery upload, category, description.
8. **Reviews** — moderation queue: pending list with Approve / Reject buttons. Approved list with Unpublish. Realtime updates.
9. **Settings** — rotating roles array, contact email, location.

All forms use react-hook-form + zod, optimistic updates via TanStack Query mutations, image uploads stream to Sanity assets through the server function.

## Implementation order

1. **Lovable Cloud + auth scaffolding** — enable Cloud, create `user_roles` + `app_role` + `has_role`, build `/auth` (email + Google), `_authenticated/` gate, admin gate, sign-out.
2. **`SANITY_WRITE_TOKEN` secret** — request from you.
3. **Server functions** — `admin-sanity.functions.ts` with `list/get/create/update/delete/uploadImage` per type, all gated.
4. **Reviews table** — migration, RLS, public submit form, admin moderation queue, realtime hook.
5. **Stats computation** — server function returning counts, hooked into home stats with realtime invalidation.
6. **Admin shell** — sidebar layout, route tree under `/admin`.
7. **Admin pages** — one per content type, built incrementally (Profile → Services → Experiences → Projects → Apps → Designs → Reviews → Settings).
8. **Detail pages** — `/apps/$slug`, `/projects/$slug`, `/designs/$slug` with loaders, `head()`, gallery components.
9. **Wire home page** — link cards to detail pages, swap reviews/stats to live sources.
10. **Verify** — Playwright smoke: sign in → admin → create app → see on marketplace → open detail page.

## Technical notes

- All admin server functions: `createServerFn().middleware([requireSupabaseAuth]).handler(async ({context}) => { const isAdmin = await context.supabase.rpc('has_role', {_user_id: context.userId, _role: 'admin'}); if (!isAdmin.data) throw new Error('Forbidden'); ... })`. Sanity write client loaded inside handler.
- Image uploads: client sends `File` → server function receives via `FormData` → uses `sanityWriteClient.assets.upload('image', buffer)` → returns asset ref → patches the doc.
- Sanity schema is already deployed; admin forms target the existing types. No schema redeploy needed unless we add gallery/long-description fields (which we will — single `deploy_schema` call to add `gallery: image[]`, `body: blockContent`, `screenshots: image[]` to project/app/design).
- TanStack Query keys are namespaced `["sanity", type]` and `["sanity", type, slug]`; admin mutations invalidate both.
- Realtime: Supabase realtime channel on `reviews` table; for Sanity stats, a manual `queryClient.invalidateQueries(["sanity", type])` after each admin mutation is enough since you're the only editor.

## What I'll ask you for during the build

- Paste your `SANITY_WRITE_TOKEN` (one prompt, one time).
- Confirm your email after signing up (so I can promote you to admin via migration).
- Approve the Lovable Cloud enablement step.

## Out of scope for this pass

- Multi-admin / invitations.
- Versioning / drafts (admin writes publish directly to Sanity).
- Bulk import.
- Analytics on admin actions.
