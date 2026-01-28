import type { Highlighter } from 'shiki';

import type { CodeTheme } from './types';
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter as createHighlighterPrimitive,
} from 'shiki';
import { defaultCodeTheme, extractShikiHtml, shikiTransformers } from './shared';

export { defaultCodeTheme } from './shared';
export type { CodeTheme, ShikiResult } from './types';

let highlighter: Highlighter | undefined;
let highlighterPromise: Promise<Highlighter> | undefined;

/**
 * Initialize highlighter (call this at app startup)
 */
export async function initHighlighter() {
  if (highlighter)
    return highlighter;
  if (highlighterPromise)
    return highlighterPromise;

  highlighterPromise = createHighlighterPrimitive({
    themes: Object.keys(bundledThemes),
    langs: Object.keys(bundledLanguages),
  });

  highlighter = await highlighterPromise;
  return highlighter;
}

/**
 * Get highlighter (sync, must call initHighlighter first)
 */
export function getHighlighter(): Highlighter | undefined {
  return highlighter;
}

export interface ShikiServerResult {
  html: string;
  bgStyle: string;
}

/**
 * Server-side Shiki highlight (sync version)
 * Must call initHighlighter() before using this
 */
export function highlightCode(
  code: string,
  language?: string,
  codeTheme?: CodeTheme,
): ShikiServerResult {
  const hl = highlighter;

  if (!hl) {
    // Fallback: return unhighlighted code
    return {
      html: escapeHtml(code),
      bgStyle: '',
    };
  }

  const lang = Object.keys(bundledLanguages).includes(language || '')
    ? language!
    : 'text';

  const fullHtml = hl.codeToHtml(code, {
    lang,
    theme: (codeTheme || defaultCodeTheme) as any,
    transformers: shikiTransformers,
  });

  return extractShikiHtml(fullHtml);
}

/**
 * Server-side function to get Shiki HTML and background style (async)
 */
export async function getShikiResult(
  code: string,
  language?: string,
  codeTheme?: CodeTheme,
): Promise<ShikiServerResult> {
  await initHighlighter();
  return highlightCode(code, language, codeTheme);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
