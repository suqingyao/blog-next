import { createElement } from 'react';
import type { Root as HashRoot } from 'hast';
import type { Root as MdashRoot } from 'mdast';
import type { BundledTheme } from 'shiki/themes';
import { VFile } from 'vfile';
import { toJsxRuntime, type ExtraProps } from 'hast-util-to-jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGithubAlerts from 'remark-gh-alerts';
import remarkBreaks from 'remark-breaks';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize from 'rehype-sanitize';
import rehypeInferDescriptionMeta from 'rehype-infer-description-meta';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toast } from 'sonner';
import { toc } from 'mdast-util-toc';
import { toHtml } from 'hast-util-to-html';
import { visit } from 'unist-util-visit';
import jsYaml from 'js-yaml';
import { isServer } from '@/lib/is';
import { consoleLog } from '@/lib/console';
import sanitizeScheme from './sanitize-schema';
import { remarkPangu } from './remark-pangu';
import { rehypeTable } from './rehype-table';
import { rehypeMermaid } from './rehype-mermaid';
import { rehypeWrapCode } from './rehype-wrap-code';
import { rehypeFixBlock } from './rehype-fix-block';
import { rehypePeekabooLink } from './rehype-peekaboo-link';
import { rehypeTaskList } from './rehype-task-list';
import { ShikiRemarkServer } from '@/components/ui/shiki-remark';
import { mdxComponents } from './components';

const memoedPreComponentMap = {} as Record<string, any>;

const hashCodeThemeKey = (codeTheme?: Record<string, any>): string => {
  if (!codeTheme) return 'default';
  return Object.values(codeTheme).join(',');
};

export const renderMarkdown = ({
  content,
  strictMode,
  codeTheme
}: {
  content: string;
  strictMode?: boolean;
  codeTheme?: {
    light?: BundledTheme;
    dark?: BundledTheme;
  };
}) => {
  let hastTree: HashRoot | undefined = undefined;
  let mdastTree: MdashRoot | undefined = undefined;

  const file = new VFile(content);

  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGithubAlerts) // make sure this is before remarkBreaks
      .use(remarkBreaks)
      .use(remarkFrontmatter, ['yaml'])
      .use(remarkGfm, {
        singleTilde: false
      })
      .use(remarkDirective)
      .use(remarkDirectiveRehype)
      .use(remarkMath, {
        singleDollarTextMath: false
      })
      .use(remarkPangu)
      .use(remarkRehype, {
        allowDangerousHtml: true
      })
      .use(rehypeRaw)
      .use(rehypeSlug)
      .use(rehypeSanitize, strictMode ? undefined : sanitizeScheme)
      .use(rehypeTable)
      .use(rehypeMermaid)
      .use(rehypeWrapCode)
      .use(rehypePeekabooLink)
      .use(rehypeTaskList) // 处理任务列表的 checkbox
      .use(rehypeFixBlock) // 必须放在其他 rehype 插件之后
      .use(rehypeInferDescriptionMeta)
      .use(rehypeKatex, {
        strict: false
      })
      .use(rehypeStringify, { allowDangerousHtml: true });

    // markdown abstract syntax tree
    mdastTree = processor.parse(file);
    // hypertext abstract syntax tree
    hastTree = processor.runSync(mdastTree, file);
  } catch (error) {
    consoleLog('ERROR', 'renderMarkdown:', error);
    if (!isServer()) {
      toast.error((error as Error).message);
    }
  }

  let Pre: React.FC<
    React.ClassAttributes<HTMLPreElement> &
      React.HTMLAttributes<HTMLPreElement> &
      ExtraProps
  > = memoedPreComponentMap[hashCodeThemeKey(codeTheme)];

  if (!Pre) {
    Pre = function Pre(props: any) {
      return createElement(
        ShikiRemarkServer,
        { ...props, codeTheme },
        props.children
      );
    };
    memoedPreComponentMap[hashCodeThemeKey(codeTheme)] = Pre;
  }

  return {
    tree: hastTree,
    toToc: () =>
      mdastTree &&
      toc(mdastTree, {
        tight: true,
        ordered: true
      }),
    toHtml: () => hastTree && toHtml(hastTree),
    toElement: () =>
      hastTree &&
      toJsxRuntime(hastTree, {
        Fragment,
        components: {
          // @ts-expect-error toJsxRuntime
          pre: Pre,
          ...mdxComponents
        },
        ignoreInvalidStyle: true,
        jsx,
        jsxs,
        passNode: true
      }),
    toMetadata: () => {
      const metadata = {
        frontMatter: undefined,
        images: [],
        audio: undefined,
        excerpt: undefined
      } as {
        frontMatter?: Record<string, any>;
        images: string[];
        audio?: string;
        excerpt?: string;
      };

      metadata.excerpt = file.data.meta?.description || undefined;

      if (mdastTree) {
        visit(mdastTree, (node, index, parent) => {
          if (node.type === 'yaml') {
            metadata.frontMatter = jsYaml.load(node.value) as Record<
              string,
              any
            >;
          }
        });
      }

      if (hastTree) {
        visit(hastTree, (node, index, parent) => {
          if (node.type === 'element') {
            if (
              node.tagName === 'img' &&
              typeof node.properties.src === 'string'
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
    }
  };
};
