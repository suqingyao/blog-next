import {
  bundledLanguages,
  bundledThemes,
  createHighlighter as _createHighlighter,
  type Highlighter
} from 'shiki';

let highlighter: Highlighter | undefined;

export const createHighlighter = async () => {
  if (!highlighter) {
    highlighter = await _createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages)
    });
  }
  return highlighter;
};
