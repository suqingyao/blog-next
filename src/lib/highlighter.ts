import type { Highlighter } from 'shiki';
import {
  createHighlighter as _createHighlighter,
  bundledLanguages,
  bundledThemes,

} from 'shiki';

let highlighter: Highlighter | undefined;

export async function createHighlighter() {
  if (!highlighter) {
    highlighter = await _createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    });
  }
  return highlighter;
}
