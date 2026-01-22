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

Reference doc: `docs/MACOS_DESIGN_SYSTEM.md`、`docs/MACOS_UI_UX_GUIDELINES.md`

## Reference Projects & Acknowledgments

This project is built by learning from and adapting code from several excellent open-source projects. All reference projects are available locally under `/Users/suqingyao/workspace/forks/` for code inspection and learning.

### 1. xLog - Markdown Rendering System
**Local Path**: `/Users/suqingyao/workspace/forks/xLog`
**GitHub**: https://github.com/Crossbell-Box/xLog
**Description**: An open-source creative community written on the blockchain

**What We Adapted**:
- **Markdown Processing Pipeline** (`src/markdown/`):
  - Unified processor with remark/rehype plugins
  - MDX component system (`src/markdown/components.tsx`)
  - Custom rehype plugins: `rehype-wrap-code`, `rehype-task-list`, `rehype-peekaboo-link`, `rehype-mermaid`, `rehype-table`
  - Remark plugins: `remark-pangu` for Chinese/English spacing
- **Markdown Rendering Components** (`src/components/ui/markdown/`):
  - `MarkdownContentServer`: Server-side rendering wrapper
  - `MarkdownContent`: Client-side rendering with TOC support
  - Code highlighting with theme switching (Shiki integration)
- **Content Model** (`src/models/post.model.ts`):
  - Post metadata extraction and frontmatter parsing
  - Reading time calculation
  - Tag and category management
- **Typography Styles** (`src/styles/typography.css`):
  - Prose styling with light/dark mode support
  - Custom code block styling
  - Table, list, and blockquote styles

**Key Features Learned**:
- Shiki syntax highlighting with dual theme support
- Custom directive handling (e.g., PeekabooLink, LinkCard)
- Math rendering with KaTeX
- GitHub Alerts (Note, Warning, Important)
- Task list with custom checkbox icons

---

### 2. Shiro - Photo Gallery & Content Management
**Local Path**: `/Users/suqingyao/workspace/forks/Shiro`
**GitHub**: https://github.com/Innei/Shiro
**Description**: A modern, aesthetic personal website and blog system

**What We Adapted**:
- **Design Philosophy**:
  - Minimalist aesthetics with attention to detail
  - Smooth animations and transitions
  - Dark mode implementation patterns
- **Component Patterns**:
  - Modal and dialog system architecture
  - Link components with hover effects (`RichLink`, `PeekabooLink`)
  - Advanced image components with optimization
- **State Management**:
  - Jotai atom patterns for global state
  - Custom hooks for UI state (e.g., `use-header-atom`, `use-title`)
- **UI/UX Patterns**:
  - Floating action buttons
  - Toast notifications (Sonner integration)
  - Smooth scroll behavior
  - Loading states and skeletons

**Key Features Learned**:
- Clean component composition patterns
- TypeScript best practices for React
- Animation choreography with Framer Motion
- Responsive design patterns

---

### 3. afilmory - Photo Management & Viewer
**Local Path**: `/Users/suqingyao/workspace/forks/afilmory`
**GitHub**: https://github.com/afilmory/afilmory
**Description**: A beautiful photo gallery and management system

**What We Adapted** (Most Comprehensive):

#### **Photo Gallery System** (`/photos`)
- **Gallery Layout** (`src/modules/gallery/`):
  - `PhotosRoot`: Main gallery container with filter state
  - Masonry vs List view switching
  - Infinite scroll with virtualization
  - Date range grouping and display
- **Filter System**:
  - URL-synced filters (tags, camera, lens, rating)
  - Multi-select tag filtering
  - Camera and lens metadata filtering
  - Star rating filter
- **Photo Cards**:
  - Lazy loading with blur-up placeholder
  - EXIF data display on hover
  - Thumbhash-based dominant color extraction
  - Responsive grid layout

#### **Photo Viewer** (`/photos/[photoId]`)
- **Full-Screen Viewer** (`src/modules/viewer/`):
  - Standalone viewer page
  - Modal overlay variant (`@modal/(.)photos/[photoId]`)
  - Keyboard navigation (arrow keys, Escape)
  - Swipe gestures for mobile
- **Viewer Features**:
  - High-resolution image loading
  - EXIF data panel
  - Share functionality
  - Download original
  - Previous/Next navigation
  - Accent color derivation from image
- **State Management**:
  - Viewer index synchronization
  - URL updates without page reload
  - Body scroll locking
  - Portal-based UI rendering

#### **Map Integration** (`/map`)
- **Interactive Map** (`src/modules/map/`):
  - Leaflet-based map component
  - Photo markers with clustering
  - Click to open photo viewer
  - Lazy loading with React.lazy + Suspense
- **Geolocation Features**:
  - GPS coordinate parsing from EXIF
  - Location-based photo grouping
  - Map bounds optimization

#### **Photo Processing Pipeline** (`scripts/`)
- **Build Scripts**:
  - `build-photos.ts`: Main photo processing orchestrator
  - Image optimization and resizing
  - EXIF metadata extraction
  - Thumbhash generation
  - Motion Photo / Live Photo support
- **Manifest Generation**:
  - `generate-manifest-from-assets.js`: Photo metadata JSON
  - Camera and lens information
  - GPS coordinates conversion (DMS to decimal)
  - Image orientation handling (EXIF rotation)

#### **Photo Data Models** (`src/types/`, `src/lib/photo-loader.ts`)
- **Type Definitions**:
  - `Photo`: Complete photo metadata
  - `PhotoExif`: EXIF data structure
  - `PhotoManifest`: Gallery manifest
- **Data Loading**:
  - `photoLoader`: Photo metadata loading utilities
  - Client/server data providers
  - Photo filtering and sorting logic

**Key Features Learned**:
- Efficient image lazy loading strategies
- EXIF data extraction and display
- Thumbhash for placeholder generation
- Virtual scrolling for large galleries
- URL state synchronization patterns
- Modal vs standalone page patterns
- Touch gesture handling
- Map integration with photo data

---

## How to Reference Source Code

When implementing features or debugging issues, you can directly read the source code from these projects:

```bash
# Read xLog markdown processing
cat ~/workspace/forks/xLog/src/markdown/index.ts

# Check afilmory photo viewer implementation
cat ~/workspace/forks/afilmory/src/modules/viewer/PhotoViewer.tsx

# Review Shiro component patterns
cat ~/workspace/forks/Shiro/src/components/ui/link/Link.tsx
```

## Attribution & License Notes

- This project maintains attribution to all referenced projects
- Each project's license is respected (check individual LICENSE files)
- Adapted code is modified to fit our architecture and requirements
- Original ideas and implementations are credited to their respective authors

**Special Thanks** to:
- [@DIYgod](https://github.com/DIYgod) and xLog contributors
- [@Innei](https://github.com/Innei) for Shiro
- [@afilmory](https://github.com/afilmory) team for the excellent photo gallery system

---

## IMPORTANT

Avoid feature gates/flags and any backwards compability changes - since our app is still unreleased" is really helpful.
Delete files must be asked for.
