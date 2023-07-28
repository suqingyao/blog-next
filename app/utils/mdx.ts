import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';
import readingTime from 'reading-time';
import matter from 'gray-matter';

const ROOT_PATH = process.cwd();

export async function getAllPostFiles() {
  const files = await fg('blog/**/*.mdx');
  return files;
}

export async function getPostBySlug(slug: string) {
  const raw = await fs.readFile(
    join(ROOT_PATH, 'blog', `${slug}.mdx`),
    'utf-8'
  );

  const { data: frontmatter, content } = matter(raw);

  return {
    content,
    frontmatter: {
      ...frontmatter,
      readingTime: readingTime(content).text.split('read')[0],
      slug
    } as Frontmatter
  };
}

export async function getAllPostFrontMatter() {
  const files = await getAllPostFiles();

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(file, 'utf-8');
      const { data, content } = matter(raw);
      return {
        ...data,
        slug: file.replace(/\.mdx$/, '').replace('blog/', ''),
        readingTime: readingTime(content).text.split('read')[0]
      } as Frontmatter;
    })
  );

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return posts;
}
