import type { FC } from 'react';
import type { Highlighter } from 'shiki';

import type { ShikiCodeProps } from './types';
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter as createHighlighterPrimitive,

} from 'shiki';
import { shikiTransformers } from './shared';

export const ShikiRender: FC<ShikiCodeProps> = async ({
  code,
  codeTheme,
  language,
}) => {
  if (!code) {
    return null;
  }

  const highlighter = await createHighlighter();

  if (!Object.keys(bundledLanguages).includes(language || '')) {
    language = 'text';
  }

  const rendered = highlighter.codeToHtml(code, {
    lang: language || 'text',
    themes: codeTheme || {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
    transformers: shikiTransformers,
  });

  return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
};

let highlighter: Highlighter | undefined;

export async function createHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighterPrimitive({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    });
  }
  return highlighter;
}
