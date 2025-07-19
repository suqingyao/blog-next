import { IS_PROD } from '@/lib/constants';
import { renderMarkdown } from '@/markdown';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path, { join } from 'node:path';

export const getAllPostFiles = async () => await fg('posts/**/*.mdx');

let memoedAllPosts: Record<string, any>[] = [];

export async function getAllPosts() {
  // 开发环境每次都重新读取文件
  if (!IS_PROD) {
    memoedAllPosts = [];
  }

  if (memoedAllPosts.length) {
    return memoedAllPosts;
  }

  const postFiles = await getAllPostFiles();

  const posts = (
    await Promise.all(
      postFiles.map(async (file) => {
        const slug = file.replace(/^posts\/(.+)\.mdx$/, '$1');
        const code = await fs.readFile(join(process.cwd(), file), 'utf-8');

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

  // 开发环境：查找匹配的文件（支持子目录）
  const postFiles = await getAllPostFiles();
  const targetFile = postFiles.find((file) => {
    const fileSlug = file.replace(/^posts\/(.+)\.mdx$/, '$1');
    return fileSlug === slug;
  });

  if (!targetFile) return null;

  const code = fs.readFileSync(join(process.cwd(), targetFile), 'utf-8');
  const rendered = renderMarkdown({ content: code });
  const renderedMetadata = rendered.toMetadata();
  const frontMatter = renderedMetadata.frontMatter;
  return { slug, code, ...frontMatter };
}
