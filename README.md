# Personal website and blog

My new [personal website and blog](https://blog-next-gray-rho.vercel.app) built with Next.js, MDX, Tailwind CSS and hosted on Vercel.

## Stack

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [MDX](https://github.com/hashicorp/next-mdx-remote)
- [Tailwind CSS](https://tailwindcss.com)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Vercel](http://vercel.com)

## Markdown Rendering

This blog uses a sophisticated markdown rendering pipeline built with [unified](https://unifiedjs.com/) ecosystem:

### Core Processing Pipeline

1. **Markdown Parsing**: Uses `remark-parse` to convert markdown to MDAST (Markdown Abstract Syntax Tree)
2. **Remark Plugins** (Markdown transformations):
   - `remark-github-alerts` - GitHub-style alerts support
   - `remark-breaks` - Line break handling
   - `remark-frontmatter` - YAML frontmatter parsing
   - `remark-gfm` - GitHub Flavored Markdown
   - `remark-directive` - Custom directive support
   - `remark-math` - Math notation support
   - `remark-pangu` - Chinese typography spacing
3. **Markdown to HTML**: `remark-rehype` converts MDAST to HAST (HTML Abstract Syntax Tree)
4. **Rehype Plugins** (HTML transformations):
   - `rehype-raw` - Raw HTML support
   - `rehype-slug` - Auto-generate heading IDs
   - `rehype-sanitize` - HTML sanitization
   - `rehype-katex` - Math rendering with KaTeX
   - Custom plugins for tables, mermaid diagrams, code wrapping, and link previews
5. **React Rendering**: `hast-util-to-jsx-runtime` converts HAST to React elements

### Features

- **Syntax Highlighting**: Powered by [Shiki](https://shiki.style/) with dual theme support
- **Math Rendering**: LaTeX math expressions via KaTeX
- **Mermaid Diagrams**: Interactive diagram support
- **Custom Components**: Link cards, previews, dark mode toggles
- **Table of Contents**: Auto-generated from headings
- **GitHub Alerts**: Note, warning, tip callouts
- **Code Copy**: One-click code block copying
- **Image Optimization**: Advanced image containers with lazy loading
- **Typography**: Automatic Chinese/English spacing with Pangu

### Custom MDX Components

The blog supports custom React components within markdown:

```jsx
// Available components
<DarkToggle />        // Theme switcher
<LinkCard />          // Rich link previews
<LinkPreview />       // Hover link previews
<PeekabooLink />      // Interactive links
<Mermaid />           // Diagram rendering
```

### File Structure

- `src/markdown/index.ts` - Main rendering pipeline
- `src/markdown/components.tsx` - Custom MDX components
- `src/markdown/rehype-*.ts` - Custom rehype plugins
- `src/markdown/remark-*.ts` - Custom remark plugins
- `posts/*.mdx` - Blog post files with frontmatter

## References
- [Anthony Fu](https://antfu.me)
- [Diu](https://ddiu.io)
- [Xiaojun Zhou](https://xiaojun.im)

## TODO

[] Comment module
[] Ai abstract
[] Ai Search
[] RSS

## License
<samp>code is licensed under <a href='./LICENSE'>MIT</a>,<br> words and images are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>CC BY-NC-SA 4.0</a></samp>.