import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

// 判断是否为外链
function isExternalLink(href: string): boolean {
  if (!href) return false;

  // 排除内部链接
  if (href.startsWith('/') || href.startsWith('#')) return false;

  // 排除相对路径
  if (!href.startsWith('http://') && !href.startsWith('https://')) return false;

  return true;
}

// 从链接文本中提取标题
function extractTitle(node: any): string {
  if (!node.children || node.children.length === 0) {
    return '';
  }

  // 获取链接文本
  const textContent = node.children
    .map((child: any) => {
      if (child.type === 'text') return child.value;
      if (child.type === 'element' && child.tagName === 'code') {
        return child.children?.[0]?.value || '';
      }
      return '';
    })
    .join('')
    .trim();

  return textContent || '链接';
}

export const rehypeLinkPreview: Plugin<Array<void>, Root> = () => {
  return (tree: Root) => {
    visit(tree, { type: 'element', tagName: 'a' }, (node, index, parent) => {
      if (
        node.properties?.href &&
        isExternalLink(node.properties.href as string) &&
        typeof index === 'number'
      ) {
        const href = node.properties.href as string;
        const title = extractTitle(node);

        // 创建 linkpreview 组件节点
        const linkPreviewNode = {
          type: 'element' as const,
          tagName: 'linkpreview',
          properties: {
            url: href,
            title
          },
          children: node.children // 保留原始链接文本作为 children
        };

        // 替换原始链接节点
        if (parent && parent.children) {
          parent.children[index] = linkPreviewNode;
        }
      }
    });
  };
};
