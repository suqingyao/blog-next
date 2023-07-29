import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';

const ROOT_PATH = process.cwd();

export async function getAllPostFiles() {
  return await fg('blog/**/*.mdx');
}

export async function getPostBySlug(slug: string) {
  const raw = await fs.readFile(join(ROOT_PATH, `${slug}.mdx`), 'utf-8');

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: raw,
    options: {
      mdxOptions: {}
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
      const slug = file.replace(/\.mdx$/, '');
      const { frontmatter } = await getPostBySlug(slug);
      return {
        ...frontmatter
      };
    })
  );

  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
