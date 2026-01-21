import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

/**
 * Remark plugin to transform code blocks
 *
 * 1. Single code blocks with [label] meta: wrap in code-block-wrapper
 * 2. Code groups (:::code-group): wrap in code-group-wrapper
 */
export const remarkCodeGroup: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // First pass: Handle code-group directives
    visit(tree, 'containerDirective', (node: any, index, parent) => {
      // Only process code-group directives
      if (node.name !== 'code-group' || index === undefined || !parent) {
        return;
      }

      // Extract labels from code block meta
      const labels: string[] = [];
      const codeBlocks = node.children.filter((child: any) => {
        if (child.type === 'code' && child.meta) {
          // Extract label from meta like "[pnpm]" or "[yarn]"
          const match = child.meta.match(/^\[([^\]]+)\]$/);
          if (match) {
            labels.push(match[1]);
            return true;
          }
        }
        return child.type === 'code';
      });

      if (codeBlocks.length === 0) {
        return;
      }

      // If no labels found in meta, try to extract from attributes
      if (labels.length === 0 && node.attributes?.labels) {
        const attrLabels = node.attributes.labels
          .replace(/^\[|\]$/g, '') // Remove [ ]
          .split(',')
          .map((l: string) => l.trim());
        labels.push(...attrLabels);
      }

      // Create HTML wrapper for code group
      // Use code-group-wrapper so rehype-code-group can process it
      const htmlNode = {
        type: 'html',
        value: `<code-group-wrapper data-labels="${labels.join(',')}">`,
      };

      const htmlCloseNode = {
        type: 'html',
        value: '</code-group-wrapper>',
      };

      // Replace the containerDirective with: opening tag + code blocks + closing tag
      const newNodes = [htmlNode, ...codeBlocks, htmlCloseNode];
      (parent.children as any[]).splice(index, 1, ...newNodes);

      // Return SKIP to avoid re-visiting the newly inserted nodes
      return [SKIP, index + newNodes.length];
    });

    // Second pass: Handle standalone code blocks (all code blocks not in a group)
    visit(tree, 'code', (node: any, index, parent) => {
      if (index === undefined || !parent) {
        return;
      }

      // Skip special languages that have their own rendering logic
      const specialLanguages = ['mermaid'];
      if (node.lang && specialLanguages.includes(node.lang.toLowerCase())) {
        return;
      }

      // Check if this code block is inside a code-group-wrapper
      // by checking if previous sibling is opening tag or next sibling is closing tag
      const siblings = parent.children as any[];
      const prevSibling = index > 0 ? siblings[index - 1] : null;
      const nextSibling = index < siblings.length - 1 ? siblings[index + 1] : null;

      const isInCodeGroup
        = (prevSibling?.type === 'html' && prevSibling.value?.includes('code-group-wrapper'))
          || (nextSibling?.type === 'html' && nextSibling.value === '</code-group-wrapper>');

      // Skip if already in a code group
      if (isInCodeGroup) {
        return;
      }

      // Determine label: use meta [label] if present, otherwise use language
      let label = node.lang || 'code';

      if (node.meta) {
        const match = node.meta.match(/^\[([^\]]+)\]$/);
        if (match) {
          label = match[1];
        }
      }

      // Wrap standalone code block with <codeblock-wrapper>
      const htmlNode = {
        type: 'html',
        value: `<codeblock-wrapper data-label="${label}">`,
      };

      const htmlCloseNode = {
        type: 'html',
        value: '</codeblock-wrapper>',
      };

      // Replace code block with: opening tag + code + closing tag
      siblings.splice(index, 1, htmlNode, node, htmlCloseNode);

      // Return SKIP to avoid re-visiting the newly inserted nodes
      return [SKIP, index + 3];
    });
  };
};
