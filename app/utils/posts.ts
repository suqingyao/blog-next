import fg from 'fast-glob';
import fs from 'fs-extra';
import matter from 'gray-matter';

export default async function getAllPosts() {
  const files = await fg('blog/**/*.md');

  const posts = await Promise.all(
    files
      .filter((i) => i.includes('index'))
      .map(async (file) => {
        const raw = await fs.readFile(file, 'utf-8');
        const { data, content } = matter(raw);

        // const html =
      })
  );

  console.log(files);
}
