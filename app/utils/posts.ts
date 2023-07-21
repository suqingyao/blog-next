import { Domain } from 'domain';
import fg from 'fast-glob';
import fs from 'fs-extra';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import Shiki from 'markdown-it-shiki';

const markdown = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
});

// markdown.use(Shiki, {
//   theme: {
//     light: 'vitesse-light',
//     dark: 'vitesse-dark'
//   },
//   highlightLines: true
// });

const DOMAIN = 'http://cullyfung.me';

export default async function getAllPosts() {
  const files = await fg('blog/**/*.md');

  const posts = await Promise.all(
    files
      .filter((i) => !i.includes('index'))
      .map(async (file) => {
        const raw = await fs.readFile(file, 'utf-8');
        const { data, content } = matter(raw);
        // TODO config DOMAIN
        const html = markdown
          .render(content)
          .replace('src="/', `src="${Domain}/`);

        if (data.image?.startsWith('/')) data.image = DOMAIN + data.image;

        return {
          ...data,
          date: new Date(data.date),
          content: html,
          author: ['cullyfung']
        };
      })
  );

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return posts;
}
