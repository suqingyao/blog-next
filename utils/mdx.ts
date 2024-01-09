import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkAdmonitions from '@/lib/remark-admonitions';
import remarkMath from 'remark-math';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeKatex from 'rehype-katex';
import components from '@/components/MDXComponents';

const ROOT_PATH = process.cwd();

export const getAllPostFiles = async () => await fg('posts/**/*.mdx');

export const getPostBySlug = async (slug: string) => {
  let raw = '';

  try {
    raw = await fs.readFile(join(ROOT_PATH, 'posts', `${slug}.mdx`), 'utf-8');
  } catch (error) {
    return null;
  }

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: raw,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkDirective,
          // @ts-ignore
          remarkAdmonitions,
          remarkMath
        ],
        rehypePlugins: [
          [
            // @ts-ignore
            rehypePrettyCode,
            {
              keepBackground: false,
              theme: {
                light: 'vitesse-light',
                dark: 'vitesse-dark'
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
            // @ts-ignore
            rehypeToc,
            {
              headings: ['h2', 'h3']
            }
          ],
          // @ts-ignore
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
};

export const getAllPostFrontMatter = async () => {
  const files = await getAllPostFiles();

  const posts: Frontmatter[] = (await Promise.all(
    files.map(async (file) => {
      // get filename not include file extension name
      const slug = file.replace(/(.*\/)*([^.]+).*/gi, '$2');
      const post = await getPostBySlug(slug);
      if (!post) return null;
      return {
        ...post.frontmatter
      };
    })
  )) as Frontmatter[];

  return posts
    .filter((item) => !!!item.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
};

export const getAdjacentPosts = async (slug: string) => {
  const posts = await getAllPostFrontMatter();
  const idx = posts.findIndex((post) => post.slug === slug);
  const prev = idx > 0 ? posts[idx - 1] : undefined;
  const next =
    idx !== -1 && idx < posts.length - 1 ? posts[idx + 1] : undefined;

  return { prev, next };
};
