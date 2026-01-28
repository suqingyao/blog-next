import type { ShikiTransformer } from 'shiki';
import type { CodeTheme } from './types';

import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';

export const shikiTransformers: ShikiTransformer[] = [
  transformerMetaHighlight(),
  transformerNotationDiff(),
  transformerNotationHighlight(),
];

// Default GitHub theme, can be overridden via codeTheme prop
export const defaultCodeTheme: CodeTheme = 'github-light';

/**
 * Extract HTML content and background style from Shiki's full HTML output
 * @param fullHtml - Full HTML output from shiki.codeToHtml()
 * @returns Object with innerHTML (code content) and bgStyle (CSS variables)
 */
export function extractShikiHtml(fullHtml: string): {
  html: string;
  bgStyle: string;
} {
  // Extract background style from pre tag (contains CSS variables for dual themes)
  const styleMatch = fullHtml.match(/<pre[^>]*style="([^"]*)"/i);
  const bgStyle = styleMatch?.[1] || '';

  // Extract innerHTML from code tag
  const codeMatch = fullHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  const html = codeMatch?.[1] || '';

  return { html, bgStyle };
}
