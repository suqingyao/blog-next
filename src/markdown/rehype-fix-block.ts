import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const BLOCK_TAGS = ['linkcard', 'darktoggle', 'linkpreview'];

export const rehypeFixBlock: Plugin<Array<void>, Root> = () => (tree: Root) => {
  visit(tree, 'element', (node, i, parent) => {
    if (
      BLOCK_TAGS.includes(node.tagName) &&
      parent &&
      parent.type === 'element' &&
      parent.tagName === 'p'
    ) {
      // 直接把 <p><linkcard /></p> 变成 <linkcard />
      parent.tagName = node.tagName;
      parent.properties = node.properties;
      parent.children = node.children;
    }
  });
};
