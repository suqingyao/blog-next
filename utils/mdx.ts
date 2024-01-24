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
import components from '@/components/mdx-components';
import { getAllNotionPost, queryNotionByPostId } from '@/lib/notion';

const ROOT_PATH = process.cwd();

export const compileRawToPost = async (raw: string) => {
  const { content, frontmatter } = await compileMDX<Post>({
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
    frontmatter,
    content
  };
};

export const getAllPostFiles = async () => await fg('posts/**/*.mdx');

export const getPostById = async (id: string) => {
  const posts = await getAllPost();
  const post = posts.find((post) => {
    return post!.id === id;
  });
  if (!post) {
    return null;
  }

  if ('fromNotion' in post) {
    try {
      return await queryNotionByPostId(id);
    } catch (error) {
      return null;
    }
  } else {
    return getLocalPostById(id);
  }
};

export const getLocalPostById = async (id: string) => {
  let raw = '';

  try {
    raw = await fs.readFile(join(ROOT_PATH, 'posts', `${id}.mdx`), 'utf-8');
  } catch (error) {
    return null;
  }

  const { content, frontmatter } = await compileRawToPost(raw);
  return {
    content,
    frontmatter: {
      ...frontmatter,
      readingTime: readingTime(raw).text.split('read')[0]
    } as Post
  };
};

export const getAllLocalPost = async () => {
  const files = await getAllPostFiles();

  const localPosts = await Promise.all(
    files.map(async (file) => {
      // get filename not include file extension name
      const slug = file.replace(/(.*\/)*([^.]+).*/gi, '$2');
      const post = await getLocalPostById(slug);
      return {
        ...post!.frontmatter
      };
    })
  );

  return localPosts.filter(Boolean);
};

export const getAllPost = async () => {
  const [localPosts, notionPosts] = await Promise.all([
    getAllLocalPost(),
    getAllNotionPost()
  ]);

  const posts = [...localPosts, ...notionPosts]
    .filter((post) => post!.published)
    .sort((a, b) => +new Date(b!.date) - +new Date(a!.date));

  return posts;
};

export const getAdjacentPosts = async (id: string) => {
  const posts = await getAllPost();
  const idx = posts.findIndex((post) => post?.id === id);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx !== -1 && idx < posts.length - 1 ? posts[idx + 1] : null;

  return { prev, next };
};
