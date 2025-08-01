import { cn } from '@/lib/utils';
import type { Root, Element, ElementContent } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Rehype 插件：处理任务列表，将 checkbox 转换为自定义图标
 * 查找包含 checkbox 的列表项，并将其转换为自定义的任务列表项
 */
export const rehypeTaskList: Plugin<Array<void>, Root> = () => (tree: Root) => {
  visit(tree, { type: 'element' }, (node, index, parent) => {
    // 类型守卫：确保 node 是 Element 类型
    if (node.type !== 'element' || node.tagName !== 'li' || !node.children) {
      return;
    }

    // 查找包含 checkbox 的 li 元素
    const hasCheckbox = node.children.some(
      (child: ElementContent) =>
        child.type === 'element' &&
        child.tagName === 'input' &&
        child.properties?.type === 'checkbox'
    );

    if (hasCheckbox) {
      // 找到 checkbox 元素
      const checkboxIndex = node.children.findIndex(
        (child: ElementContent) =>
          child.type === 'element' &&
          child.tagName === 'input' &&
          child.properties?.type === 'checkbox'
      );

      if (checkboxIndex !== -1) {
        const checkbox = node.children[checkboxIndex] as Element;
        const isChecked =
          checkbox.properties?.checked === true ||
          checkbox.properties?.checked === '';

        // 创建自定义图标元素
        const iconElement: Element = {
          type: 'element',
          tagName: isChecked ? 'taskcheckedicon' : 'taskuncheckedicon',
          properties: {
            className: 'task-list-icon w-4 h-4 -ml-1',
            'data-checked': isChecked ? 'true' : 'false'
          },
          children: []
        };

        // 替换 checkbox 为自定义图标
        node.children[checkboxIndex] = iconElement;

        // 为 li 元素添加任务列表标识类名
        if (!node.properties) {
          node.properties = {};
        }

        const existingClassName = node.properties.className;
        let classNames = 'task-list-item';

        if (typeof existingClassName === 'string') {
          classNames = `${existingClassName} ${classNames}`;
        } else if (Array.isArray(existingClassName)) {
          classNames = `${existingClassName.join(' ')} ${classNames}`;
        }

        node.properties.className = classNames;

        // 标记父级 ul 为任务列表
        if (parent && parent.type === 'element' && parent.tagName === 'ul') {
          if (!parent.properties) {
            parent.properties = {};
          }

          const parentClassName = parent.properties.className;
          let parentClassNames = 'contains-task-list pl-4';

          if (typeof parentClassName === 'string') {
            parentClassNames = cn(parentClassName, parentClassNames);
            if (!parentClassName.includes('contains-task-list')) {
              parentClassNames = `${parentClassName} ${parentClassNames}`;
            } else {
              parentClassNames = parentClassName;
            }
          } else if (Array.isArray(parentClassName)) {
            if (!parentClassName.includes('contains-task-list')) {
              parentClassNames = `${parentClassName.join(' ')} ${parentClassNames}`;
            } else {
              parentClassNames = parentClassName.join(' ');
            }
          }

          parent.properties.className = parentClassNames;
        }
      }
    }
  });
};
