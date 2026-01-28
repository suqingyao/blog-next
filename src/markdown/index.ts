import type { Root as HashRoot } from 'hast';
import type { ExtraProps } from 'hast-util-to-jsx-runtime';
import type { Root as MdashRoot } from 'mdast';
import type { Processor } from 'unified';
import type { CodeTheme } from '@/lib/shiki/types';
import { toHtml } from 'hast-util-to-html';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import jsYaml from 'js-yaml';
import { toc } from 'mdast-util-toc';
import { createElement } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import readingTime from 'reading-time';
import rehypeInferDescriptionMeta from 'rehype-infer-description-meta';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkGithubAlerts from 'remark-gh-alerts';

import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { toast } from 'sonner';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { consoleLog } from '@/lib/console';
import { isServer } from '@/lib/is';
import { createMdxComponents, mdxComponents } from './components';
import { rehypeCodeBlock } from './rehype-code-block';
import { rehypeCodeGroup } from './rehype-code-group';
import { rehypeFixBlock } from './rehype-fix-block';
import { rehypeMermaid } from './rehype-mermaid';
import { rehypePeekabooLink } from './rehype-peekaboo-link';
import { rehypeTable } from './rehype-table';
import { remarkCodeGroup } from './remark-code-group';
import { remarkPangu } from './remark-pangu';
import sanitizeScheme from './sanitize-schema';

const processorCache = new Map<boolean, Processor<any, any, any, any, any>>();

function getMarkdownProcessor(strictMode?: boolean) {
  const cacheKey = Boolean(strictMode);
  const cached = processorCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const processor: Processor<any, any, any, any, any> = unified()
    .use(remarkParse)
    .use(remarkGithubAlerts)
    .use(remarkBreaks)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm, {
      singleTilde: false,
    })
    .use(remarkDirective)
    .use(remarkCodeGroup)
    .use(remarkDirectiveRehype)
    .use(remarkMath, {
      singleDollarTextMath: false,
    })
    .use(remarkPangu)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeCodeBlock)
    .use(rehypeRaw)
    .use(rehypeCodeGroup)
    .use(rehypeSlug)
    .use(rehypeSanitize, strictMode ? undefined : sanitizeScheme)
    .use(rehypeTable)
    .use(rehypeMermaid)
    .use(rehypePeekabooLink)
    .use(rehypeFixBlock)
    .use(rehypeInferDescriptionMeta)
    .use(rehypeKatex, {
      strict: false,
    });

  processorCache.set(cacheKey, processor);
  return processor;
}

export function renderMarkdown({
  content,
  strictMode,
  codeTheme,
}: {
  content: string;
  strictMode?: boolean;
  codeTheme?: CodeTheme;
}) {
  let hastTree: HashRoot | undefined;
  let mdastTree: MdashRoot | undefined;

  const file = new VFile(content);

  try {
    const processor = getMarkdownProcessor(strictMode);

    // markdown abstract syntax tree
    mdastTree = processor.parse(file) as MdashRoot;
    // hypertext abstract syntax tree
    hastTree = processor.runSync(mdastTree, file) as HashRoot;
  }
  catch (error) {
    consoleLog('ERROR', 'renderMarkdown:', error);
    if (!isServer()) {
      toast.error((error as Error).message);
    }
  }

  return {
    tree: hastTree,
    toToc: () =>
      mdastTree
      && toc(mdastTree, {
        tight: true,
        ordered: true,
      }),
    toHtml: () => hastTree && toHtml(hastTree),
    toElement: () =>
      hastTree
      && toJsxRuntime(hastTree, {
        Fragment,
        components: {
          ...mdxComponents,
          ...createMdxComponents(codeTheme),
        },
        ignoreInvalidStyle: true,
        jsx,
        jsxs,
        passNode: true,
      } as any),
    toMetadata: () => {
      const metadata = {
        frontMatter: undefined,
        images: [],
        audio: undefined,
        excerpt: undefined,
      } as {
        frontMatter?: Record<string, any>;
        images: string[];
        audio?: string;
        excerpt?: string;
      };

      metadata.excerpt = file.data.meta?.description || undefined;

      if (mdastTree) {
        visit(mdastTree, (node) => {
          if (node.type === 'yaml') {
            metadata.frontMatter = jsYaml.load(node.value) as Record<
              string,
              any
            >;
            metadata.frontMatter.readingTime = readingTime(node.value).text;
          }
        });
      }

      if (hastTree) {
        visit(hastTree, (node) => {
          if (node.type === 'element') {
            if (
              node.tagName === 'img'
              && typeof node.properties.src === 'string'
            ) {
              metadata.images.push(node.properties.src);
            }
            if (node.tagName === 'audio') {
              if (typeof node.properties.cover === 'string') {
                metadata.images.push(node.properties.cover);
              }
              if (!metadata.audio && typeof node.properties.src === 'string') {
                metadata.audio = node.properties.src;
              }
            }
          }
        });
      }

      return metadata;
    },
  };
}
