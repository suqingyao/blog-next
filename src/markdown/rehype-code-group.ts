import type { Element, Root } from 'hast';
import type { Plugin } from 'unified';
import { toString as hastToString } from 'hast-util-to-string';
import { SKIP, visit } from 'unist-util-visit';

// Separator for multiple code blocks in data-code attribute
const CODE_SEPARATOR = '|||';

/**
 * Extract language from className (e.g., "language-bash" -> "bash")
 */
function extractLanguage(classNames: any): string | undefined {
  if (!classNames)
    return undefined;

  const classes = Array.isArray(classNames) ? classNames : [classNames];

  for (const cls of classes) {
    if (typeof cls === 'string' && cls.startsWith('language-')) {
      return cls.replace('language-', '');
    }
  }

  return undefined;
}

/**
 * Extract code content from a <pre> element
 */
function extractCodeContent(preElement: Element): { code: string; language?: string } {
  // Find the <code> element inside <pre>
  const codeElement = preElement.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'code',
  );

  if (!codeElement) {
    return { code: hastToString(preElement), language: undefined };
  }

  // Extract language from className
  const language = extractLanguage(codeElement.properties?.className);

  // Extract code content (handle both text nodes and element nodes)
  const code = hastToString(codeElement);

  return { code, language };
}

/**
 * Options to customize the Rehype Code Group plugin.
 */
export interface RehypeCodeGroupOptions {
  // Reserved for future use
}

export const rehypeCodeGroup: Plugin<[RehypeCodeGroupOptions?], Root> = (
  _ = {},
) => {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.type !== 'element' || index === undefined || !parent) {
        return;
      }

      // Handle code-group-wrapper (from remark-code-group)
      // Transform it to <codegroup> with extracted data
      if (node.tagName === 'code-group-wrapper') {
        // Extract labels (rehypeRaw converts data-labels to dataLabels)
        const dataLabels = node.properties.dataLabels || node.properties['data-labels'];
        const tabLabels = typeof dataLabels === 'string'
          ? dataLabels.split(',').map(l => l.trim()).filter(Boolean)
          : [];

        if (tabLabels.length === 0) {
          return;
        }

        // Find all <pre> elements (code blocks) in children
        const codeBlocks: Element[] = [];
        const findCodeBlocks = (children: any[]) => {
          for (const child of children) {
            if (child.type === 'element' && child.tagName === 'pre') {
              codeBlocks.push(child);
            }
            else if (child.children) {
              findCodeBlocks(child.children);
            }
          }
        };
        findCodeBlocks(node.children);

        if (codeBlocks.length === 0) {
          return;
        }

        // Extract code content and language from each code block
        const codes: string[] = [];
        const languages: string[] = [];

        codeBlocks.forEach((block) => {
          const { code, language } = extractCodeContent(block);
          codes.push(code);
          languages.push(language || '');
        });

        // Create <codegroup> element
        const newNode: Element = {
          type: 'element',
          tagName: 'codegroup',
          properties: {
            'data-labels': tabLabels.join(','),
            'data-code': codes.join(CODE_SEPARATOR),
            'data-language': languages.join(','),
          },
          children: [],
        };

        // Replace the node in parent
        (parent as any).children[index] = newNode;

        return [SKIP];
      }

      // Handle codeblock-wrapper (from remark-code-group)
      // Transform it to <codeblock> with extracted data
      if (node.tagName === 'codeblock-wrapper') {
        // Get the label
        const dataLabel = node.properties?.dataLabel || node.properties?.['data-label'];

        if (!dataLabel) {
          return;
        }

        // Find the <pre> element inside
        const preElement = node.children.find(
          (child): child is Element => child.type === 'element' && child.tagName === 'pre',
        );

        if (!preElement) {
          return;
        }

        // Extract code and language
        const { code, language } = extractCodeContent(preElement);

        // Create <codeblock> element
        const newNode: Element = {
          type: 'element',
          tagName: 'codeblock',
          properties: {
            'data-label': String(dataLabel),
            'data-code': code,
            'data-language': language || '',
          },
          children: [],
        };

        // Replace the node in parent
        (parent as any).children[index] = newNode;

        return [SKIP];
      }
    });
  };
};
