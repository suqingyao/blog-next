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
// import { transformerCopyButton } from '@rehype-pretty/transformers';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import components from '@/components/mdx-components';
import { visit } from 'unist-util-visit';

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
          () => (tree) => {
            visit(tree, (node) => {
              if (node?.type === 'element' && node?.tagName === 'pre') {
                const [codeEl] = node.children;

                if (codeEl.tagName !== 'code') return;

                node.raw = codeEl.children?.[0].value;
              }
            });
          },
          [
            // @ts-ignore
            rehypePrettyCode,
            {
              keepBackground: false,
              theme: {
                light: 'vitesse-light',
                dark: 'vitesse-dark'
              }
              // transformers: [
              //   transformerCopyButton({
              //     visibility: 'always',
              //     feedbackDuration: 3_000
              //   })
              // ]
            }
          ],
          () => (tree) => {
            visit(tree, (node) => {
              if (node?.type === 'element' && node.tagName === 'figure') {
                if (!('data-rehype-pretty-code-figure' in node.properties)) {
                  return;
                }
                for (const child of node.children) {
                  if (child.tagName === 'pre') {
                    child.properties['raw'] = node.raw;
                  }
                }
              }
            });
          },
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
              headings: ['h2', 'h3'],
              cssClasses: {
                toc: 'toc',
                list: 'toc-list',
                listItem: 'toc-item',
                link: 'toc-link'
              }
            }
          ],
          () => (tree) => {
            visit(tree, (node) => {
              if (node?.type === 'element' && node.tagName === 'nav') {
                if (!node.properties.className?.includes('toc')) {
                  return;
                }
                const results = extractTocLinks(node);
                node.properties['toc'] = JSON.stringify(results);
              }
            });
          },
          // @ts-ignore
          rehypeKatex,
          rehypeStringify
        ]
      }
    }
  });

  return {
    frontmatter,
    content
  };
};

interface TocItem {
  title: string;
  href: string;
  key: string;
  children?: TocItem[];
}

interface Node {
  type: string;
  tagName: string;
  properties?: { [key: string]: any };
  children?: Node[];
  value?: string;
}

function extractTocLinks(node: Node): TocItem[] {
  const result: TocItem[] = [];

  function traverse(nodes: Node[], parent: TocItem | null = null): void {
    for (const node of nodes) {
      if (
        node.type === 'element' &&
        node.tagName === 'a' &&
        node.properties?.className?.includes('toc-link')
      ) {
        const newItem: TocItem = {
          title:
            node.children?.[0]?.type === 'text'
              ? node.children?.[0]?.value!
              : '',
          href: node.properties.href || '',
          key: node.properties.href || ''
        };

        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(newItem);
        } else {
          result.push(newItem);
        }

        parent = newItem; // Set the current item as the parent for further traversals
      }

      if (node.children) {
        traverse(node.children, parent);
      }
    }

    // Remove empty children arrays
    if (parent && parent.children && parent.children.length === 0) {
      delete parent.children;
    }
  }

  traverse(node.children || []);
  return result;
}

export const getAllPostFiles = async () => await fg('posts/**/*.mdx');

export const getPostById = async (id: string) => {
  const posts = await getAllPost();
  const post = posts.find((post) => {
    return post!.id === id;
  });
  if (!post) {
    return null;
  }

  return getLocalPostById(id);
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

export const cachedAllPosts = [] as Post[];

export const getAllLocalPost = async () => {
  if (cachedAllPosts.length > 0) {
    return cachedAllPosts;
  }

  const files = await getAllPostFiles();

  const localPosts = (
    await Promise.all(
      files.map(async (file) => {
        // get filename not include file extension name
        const slug = file.replace(/(.*\/)*([^.]+).*/gi, '$2');
        const post = await getLocalPostById(slug);
        return {
          ...post!.frontmatter
        };
      })
    )
  ).filter(Boolean);

  return localPosts;
};

export const getAllPost = async () => {
  const [localPosts] = await Promise.all([getAllLocalPost()]);

  const posts = [...localPosts]
    .filter((post) => post.published)
    .sort((a, b) => +new Date(b!.createdTime) - +new Date(a!.createdTime));

  return posts;
};

export const getAdjacentPosts = async (id: string) => {
  const posts = await getAllPost();
  const idx = posts.findIndex((post) => post?.id === id);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx !== -1 && idx < posts.length - 1 ? posts[idx + 1] : null;

  return { prev, next };
};
