import { CheckedIcon, HorizontalIcon, UncheckedIcon } from '@/components/icons';
import { PeekabooLink } from '@/components/links';
import { AdvancedImageContainer } from '@/components/ui/advanced-image';
import { DarkToggle } from '@/components/ui/dark-toggle';
import { LinkCard } from '@/components/ui/link-card';
import { LinkPreview } from '@/components/ui/link-preview';
import { createMarkdownHeaderComponent } from '@/components/ui/markdown-render';
import { Mermaid } from '@/components/ui/mermaid';

export const mdxComponents = {
  // hast-util-to-jsx-runtime 可能会转换大小写
  darktoggle: DarkToggle,
  linkcard: LinkCard,
  linkpreview: LinkPreview,
  peekaboolink: PeekabooLink,
  hr: HorizontalIcon,
  mermaid: Mermaid,
  img: AdvancedImageContainer,
  // 任务列表图标组件
  taskcheckedicon: CheckedIcon,
  taskuncheckedicon: UncheckedIcon,
  h1: createMarkdownHeaderComponent('h1'),
  h2: createMarkdownHeaderComponent('h2'),
  h3: createMarkdownHeaderComponent('h3'),
  h4: createMarkdownHeaderComponent('h4'),
  h5: createMarkdownHeaderComponent('h5'),
  h6: createMarkdownHeaderComponent('h6'),
};
