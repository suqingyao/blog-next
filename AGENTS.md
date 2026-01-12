# Repository Guidelines

## Architecture & Key Pages
- Next.js 16 App Router with shared `layout.tsx` (providers, music player, dot-grid background) and an `@modal` parallel route for overlay experiences. Global providers (`src/providers`) supply React Query, Jotai state, theme, and a photo manifest context.
- Content sources: MDX posts in `posts/` (hydrated via `models/post.model` and rendered with `MarkdownContentServer`), photo metadata loaded through `photoLoader` utilities, and Tailwind 4 styling.
- Key routes:
  - `/` — `AppHero` + `AppLatestPosts`.
  - `/posts` — server-rendered list; `/posts/[slug]` statically renders MDX with TOC and code themes.
  - `/tags` — server component computing tag counts client-side via `TagList`.
  - `/photos` — **adapted from afilmory** (`/Users/suqingyao/workspace/forks/afilmory`): client page syncing gallery filters (tags/camera/lens/rating) to URL, switches ScrollArea vs body scroll on mobile, renders `PhotosRoot` with masonry/list, floating action panel, and date-range awareness.
  - `/photos/[photoId]` — **adapted from afilmory**: standalone full-screen viewer; derives accent color from thumbhash/thumbnail, locks body scroll via `RemoveScroll`, portals UI with `RootPortalProvider`, and syncs viewer index on mount.
  - `@/modal/(.)photos/[photoId]` — **adapted from afilmory**: modal overlay variant that keeps `/photos` behind; updates URL on index change and routes close to `/photos`, reusing the same viewer state to avoid reloads.
  - `/map` — **adapted from afilmory**: lazy-loaded `MapSection` (React lazy + Suspense boundary in consumer).

## Project Structure & Modules
- Routes in `src/app`; shared UI in `src/components` and `src/modules` (gallery, viewer, map, search, music). State atoms in `src/store`, hooks in `src/hooks`, utilities in `src/lib`, styles in `src/styles` and `tailwind.config.ts`, photo/post types in `src/types`/`typings`. Scripts for content/media tooling live in `scripts/`.

## Build, Test, Development
- `pnpm dev` (port 2323), `pnpm build`, `pnpm start`.
- Quality gates: `pnpm lint` / `pnpm lint:fix`; content checks `pnpm check:posts` (also pre-commit). Content/media helpers: `pnpm new:post`, `pnpm generate:search-index`, `pnpm compress:images`, `pnpm optimize:images`, `pnpm generate:manifest` and `pnpm generate:summaries(:force)`.

## Code Quality Rules

1. Avoid code duplication - extract common types and components.
2. Keep components focused - use hooks and component composition.
3. Follow React best practices - proper Context usage, state management.
4. Use TypeScript strictly - leverage type safety throughout.
5. Build React features out of small, atomic components. Push data fetching, stores, and providers down to the feature or tab that actually needs them so switching views unmounts unused logic and prevents runaway updates instead of centralizing everything in a mega component.

## Coding Style & Naming
- TypeScript + React 19; prefer server components, add `"use client"` only when required. 2-space indent, single quotes, semicolons, Next/Antfu ESLint config; `no-console` warns. File names kebab-case for routes/components; utilities camelCase; favor named exports. Tailwind + `tailwind-variants`; keep tokens in `tailwind.config.ts` and co-locate component styles.

## Testing & Quality Notes
- No dedicated unit suite yet; rely on lint + `check:posts`. Manually sanity-check `/`, `/posts/[slug]`, `/photos` modal flows (light/dark). Regenerate search index after post edits and rerun photo scripts after media changes.

## Commit & PR Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`) as in history. Keep messages imperative and scoped.
- PRs should note run scripts, link issues, summarize UI impacts, and include screenshots/gifs for visual changes (especially photos viewer).

## Environment & Security
- Copy `.env.example` to `.env.local`/`.env.production`; set `NEXT_PUBLIC_OUR_DOMAIN`, OSS keys, optional Spark/OpenAI keys, `NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED`. Do not commit secrets or generated `.next/`/media outputs; rebuild via provided scripts.

## Design System

For specific UI and design guidelines, please refer to the `AGENTS.md` file within each application's directory:

Contains the "Glassmorphic Depth Design System" for the main user-facing photo gallery.

## IMPORTANT

Avoid feature gates/flags and any backwards compability changes - since our app is still unreleased" is really helpful.
