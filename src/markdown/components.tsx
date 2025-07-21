import { createMarkdownHeaderComponent } from '@/components/ui/markdown-render';

import { DarkToggle } from '@/components/ui/dark-toggle/DarkToggle';
import { LinkCard } from '@/components/ui/link-card/LinkCard';
import { LinkPreview } from '@/components/ui/link-preview/LinkPreview';
import { PeekabooLink } from '@/components/links';
import { HorizontalIcon } from '@/components/icons';

export const mdxComponents = {
  // hast-util-to-jsx-runtime 可能会转换大小写
  darktoggle: DarkToggle,
  linkcard: LinkCard,
  linkpreview: LinkPreview,
  peekaboolink: PeekabooLink,
  hr: HorizontalIcon,
  h1: createMarkdownHeaderComponent('h1'),
  h2: createMarkdownHeaderComponent('h2'),
  h3: createMarkdownHeaderComponent('h3'),
  h4: createMarkdownHeaderComponent('h4'),
  h5: createMarkdownHeaderComponent('h5'),
  h6: createMarkdownHeaderComponent('h6')
};
