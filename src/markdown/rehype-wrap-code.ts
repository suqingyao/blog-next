import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { u } from 'unist-builder';
import { visit } from 'unist-util-visit';

export const rehypeWrapCode: Plugin<Array<void>, Root> = () => {
  return (tree: Root) => {
    visit(tree, { type: 'element', tagName: 'pre' }, (node, index, parent) => {
      if (parent && typeof index === 'number') {
        const wrapper = u('element', {
          tagName: 'div',
          properties: {
            className: 'code-wrapper',
          },
          children: [
            u('element', {
              tagName: 'button',
              properties: {
                type: 'button',
                className: 'copy-button flex items-center space-x-1',
              },
              children: [
                u('element', {
                  tagName: 'span',
                  properties: {
                    className: 'i-mingcute-copy-2-line',
                  },
                  children: [],
                }),
                u('element', {
                  tagName: 'span',
                  properties: {},
                  children: [u('text', 'Copy')],
                }),
              ],
            }),
            node,
          ],
        });
        parent.children[index] = wrapper;
      }
    });
  };
};
