import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import components from '@/app/components/MDXComponents';

const ROOT_PATH = process.cwd();

const BLOG_DIR = join(ROOT_PATH, 'blog');

export async function getAllPostFiles() {
  return await fg('blog/**/*.mdx');
}

export async function getPostBySlug(slug: string) {
  const raw = await fs.readFile(join(BLOG_DIR, `${slug}.mdx`), 'utf-8');

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: raw,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
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
              behavior: 'wrap'
            }
          ]
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
      const slug = file.replace(/(.*\/)*([^.]+).*/gi, '$2');
      const { frontmatter } = await getPostBySlug(slug);
      return {
        ...frontmatter
      };
    })
  );

  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
