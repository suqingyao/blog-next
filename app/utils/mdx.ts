import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkAdmonitions from '@/app/lib/remark-admonitions';
import remarkMath from 'remark-math';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeKatex from 'rehype-katex';
import components from '@/app/components/MDXComponents';

const ROOT_PATH = process.cwd();

const POSTS_DIR = join(ROOT_PATH, 'posts');

export async function getAllPostFiles() {
  return await fg('posts/**/*.mdx');
}

export async function getPostBySlug(slug: string) {
  const raw = await fs.readFile(join(POSTS_DIR, `${slug}.mdx`), 'utf-8');

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: raw,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkDirective,
          remarkAdmonitions,
          remarkMath
        ],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              keepBackground: false,
              theme: {
                dark: 'vitesse-dark',
                light: 'vitesse-light'
              }
            }
          ],
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              properties: {
                class: 'anchor'
              }
            }
          ],
          [
            rehypeToc,
            {
              headings: ['h2', 'h3', 'h4']
            }
          ],
          rehypeKatex
        ]
      }
    }
  });
  return {
    content,
    frontmatter: {
      ...frontmatter,
      readingTime: readingTime(raw).text.split('read')[0],
      slug
    } as Frontmatter
  };
}

export async function getAllPostFrontMatter() {
  const files = await getAllPostFiles();

  const posts: Frontmatter[] = await Promise.all(
    files.map(async (file) => {
      // get filename not include file extension name
      const slug = file.replace(/(.*\/)*([^.]+).*/gi, '$2');
      const { frontmatter } = await getPostBySlug(slug);
      return {
        ...frontmatter
      };
    })
  );

  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getAdjacentPosts(slug: string) {
  const posts = await getAllPostFrontMatter();
  const idx = posts.findIndex((post) => post.slug === slug);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx !== -1 && idx < posts.length - 1 ? posts[idx + 1] : null;

  return { prev, next };
}
