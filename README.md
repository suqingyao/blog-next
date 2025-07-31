# Blog Next

A modern personal blog built with Next.js 14, featuring MDX support, advanced search functionality, and dark mode.

🌐 **Live Demo**: [blog-next-gray-rho.vercel.app](https://blog-next-gray-rho.vercel.app)

## ✨ Features

- 📝 **MDX Support**: Write content in Markdown with React components
- 🔍 **Advanced Search**: Fast local search with keyboard shortcuts (Cmd+K)
- 🎨 **Syntax Highlighting**: Powered by Shiki with dual theme support
- 🌙 **Dark Mode**: System-aware dark/light theme switching
- 📊 **Math & Diagrams**: LaTeX math expressions and Mermaid diagrams
- 📱 **Responsive Design**: Mobile-first responsive layout
- ⚡ **Performance**: Optimized for speed and SEO
- 🎯 **Accessibility**: WCAG compliant with keyboard navigation

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Content**: [MDX](https://github.com/hashicorp/next-mdx-remote)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animation**: [Motion](https://github.com/motiondivision/motion)
- **Icons**: [@egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons)
- **Deployment**: [Vercel](http://vercel.com)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd blog-next

# Install dependencies
pnpm install

# Generate search index
pnpm generate:search-index

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Search
pnpm generate:search-index  # Generate search index
```

## 📝 Content Management

### Writing Posts

1. Create a new `.mdx` file in the `posts/` directory
2. Add frontmatter with metadata:

```yaml
---
title: "Your Post Title"
summary: "Brief description of your post"
createdTime: "2024-01-01"
tags: ["tag1", "tag2"]
published: true
---
```

3. Write your content using Markdown and custom components
4. Regenerate the search index: `pnpm generate:search-index`

### Custom MDX Components

The blog supports various custom React components:

```jsx
<DarkToggle />        // Theme switcher
<LinkCard />          // Rich link previews
<LinkPreview />       // Hover link previews
<Mermaid />           // Diagram rendering
```

## 🔍 Search Functionality

### Features

- **Real-time Search**: Instant results as you type
- **Keyboard Shortcuts**: Quick access with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
- **Smart Matching**: Search across titles, content, and tags
- **Highlighting**: Visual emphasis on matching terms
- **Responsive**: Works seamlessly on all devices

### Usage

1. **Open Search Modal**:
   - Click the search icon in the navigation
   - Use keyboard shortcut: `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)

2. **Navigate Results**:
   - Use arrow keys to navigate
   - Press `Enter` to open selected article
   - Press `Esc` to close

### Technical Implementation

- **Search Index**: Generated from MDX frontmatter and content
- **Local Search**: Client-side search for fast performance
- **API Endpoint**: `/api/search` for search queries
- **Components**: Modal-based search interface

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── posts/            # Blog posts routes
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/              # UI components
│   ├── search/          # Search components
│   ├── icons/           # Icon components
│   └── layout/          # Layout components
├── lib/                 # Utility functions
├── hooks/              # Custom React hooks
├── markdown/           # Markdown processing
└── types/              # TypeScript definitions
posts/                  # MDX blog posts
public/                # Static assets
├── search-index.json  # Generated search index
└── ...
```

## 🎨 Markdown Processing Pipeline

The blog uses a sophisticated markdown rendering pipeline:

### Core Pipeline

1. **Markdown Parsing**: `remark-parse` converts markdown to MDAST
2. **Remark Plugins**: Transform markdown (GFM, math, frontmatter)
3. **HTML Conversion**: `remark-rehype` converts to HAST
4. **Rehype Plugins**: Transform HTML (syntax highlighting, sanitization)
5. **React Rendering**: Convert to React elements

### Supported Features

- **Syntax Highlighting**: Shiki with theme support
- **Math Expressions**: KaTeX rendering
- **Mermaid Diagrams**: Interactive diagrams
- **GitHub Alerts**: Note, warning, tip callouts
- **Code Copying**: One-click code block copying
- **Auto-generated TOC**: Table of contents from headings

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Manual Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## 📄 License

- **Code**: Licensed under [MIT](./LICENSE)
- **Content**: Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 🙏 Acknowledgments

Inspired by:
- [Anthony Fu](https://antfu.me)
- [Diu](https://ddiu.io)
- [Xiaojun Zhou](https://xiaojun.im)
- [Innei](https://innei.in)
- [Cali](https://cali.so)
---

**Built with ❤️ using Next.js and TypeScript**