import { createMarkdownHeaderComponent } from '@/components/ui/markdown-render';

import { DarkToggle } from '@/components/ui/dark-toggle/DarkToggle';
import { LinkCard } from '@/components/ui/link-card/LinkCard';

export const mdxComponents = {
  // hast-util-to-jsx-runtime 可能会转换大小写
  darktoggle: DarkToggle,
  linkcard: LinkCard,
  h1: createMarkdownHeaderComponent('h2'),
  h2: createMarkdownHeaderComponent('h3'),
  h3: createMarkdownHeaderComponent('h4'),
  h4: createMarkdownHeaderComponent('h5'),
  h5: createMarkdownHeaderComponent('h6')
};
