import dynamic from 'next/dynamic';
import { createMarkdownHeaderComponent } from '@/components/ui/markdown-render';

export const mdxComponents = {
  darktoggle: dynamic(
    async () => (await import('@/components/ui/dark-toggle')).DarkToggle
  ),
  linkcard: dynamic(
    async () => (await import('@/components/ui/link-card')).LinkCard
  ),
  h1: createMarkdownHeaderComponent('h2'),
  h2: createMarkdownHeaderComponent('h3'),
  h3: createMarkdownHeaderComponent('h4'),
  h4: createMarkdownHeaderComponent('h5'),
  h5: createMarkdownHeaderComponent('h6')
};
