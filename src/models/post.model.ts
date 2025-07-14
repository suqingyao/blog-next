import { IS_PROD } from '@/lib/constants';
import { renderMarkdown } from '@/markdown';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path, { join } from 'node:path';

export const getAllPostFiles = async () => await fg('posts/**/*.mdx');

let memoedAllPosts: Record<string, any>[] = [];

export async function getAllPosts() {
  if (memoedAllPosts.length) {
    return memoedAllPosts;
  }

  const postFiles = await getAllPostFiles();

  const posts = (
    await Promise.all(
      postFiles.map(async (file) => {
        // get filename not include file extension name
        const slug = file.replace(/(.*\/)*([^.]+).*/gi, '$2');
        const code = await fs.readFile(
          join(process.cwd(), 'posts', `${slug}.mdx`),
          'utf-8'
        );

        const rendered = renderMarkdown({ content: code });

        const renderedMetadata = rendered.toMetadata();

        const frontMatter = renderedMetadata.frontMatter;

        return {
          slug,
          code,
          ...frontMatter
        } as Record<string, any>;
      })
    )
  )
    .filter(Boolean)
    .filter((post) => (IS_PROD ? post.published : true))
    .sort((a, b) => +new Date(b.createdTime) - +new Date(a.createdTime));

  memoedAllPosts = posts;

  return posts;
}

export async function getPostBySlug(slug: string) {
  if (IS_PROD) {
    const posts = await getAllPosts();
    const post = posts.find((post) => post.slug === slug);
    return post;
  }

  const filePath = path.join(process.cwd(), 'posts', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const code = fs.readFileSync(filePath, 'utf-8');
  const rendered = renderMarkdown({ content: code });
  const renderedMetadata = rendered.toMetadata();
  const frontMatter = renderedMetadata.frontMatter;
  return { slug, code, ...frontMatter };
}
