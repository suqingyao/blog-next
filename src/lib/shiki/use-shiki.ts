'use client';

import type { BundledLanguage, BundledTheme, DynamicImportLanguageRegistration, DynamicImportThemeRegistration, HighlighterCore } from 'shiki';
import type { CodeTheme, ShikiCodeProps } from './types';

import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultCodeTheme, extractShikiHtml, shikiTransformers } from './shared';

let highlighterCore: HighlighterCore | null = null;
const codeHighlighterPromise = (async () => {
  if (highlighterCore)
    return highlighterCore;
  const [{ createHighlighterCore }, getWasm] = await Promise.all([
    import('shiki/core'),
    import('shiki/wasm').then(m => m.default),
  ]);

  const core = await createHighlighterCore({
    themes: [
      import('shiki/themes/github-light.mjs'),
      import('shiki/themes/github-dark.mjs'),
    ],
    langs: [],
    loadWasm: getWasm,
  });

  highlighterCore = core;
  return core;
})();

let langModule: Record<BundledLanguage, DynamicImportLanguageRegistration> | null = null;
let themeModule: Record<BundledTheme, DynamicImportThemeRegistration> | null = null;

export interface UseShikiResult {
  /** HTML content (spans only, use with dangerouslySetInnerHTML) */
  html: string | null;
  /** Background style with CSS variables for light/dark themes */
  bgStyle: string | null;
  isLoading: boolean;
}

/**
 * Hook to get Shiki highlighted HTML using structure: 'inline'
 * Returns only spans with <br> for line breaks, no pre/code wrapper
 */
export function useShiki({
  code,
  language,
  codeTheme = defaultCodeTheme,
}: ShikiCodeProps): UseShikiResult {
  const [shiki, setShiki] = useState<HighlighterCore | null>(null);
  const [ready, setReady] = useState(false);
  const loadThemesRef = useRef([] as string[]);
  const loadLanguagesRef = useRef([] as string[]);

  // Load highlighter
  useEffect(() => {
    let mounted = true;
    codeHighlighterPromise.then((core) => {
      if (mounted)
        setShiki(core);
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Register language and themes
  useEffect(() => {
    if (!shiki || !language || !codeTheme)
      return;
    let cancelled = false;

    async function register() {
      async function loadShikiLanguage(lang: string, languageModule: any) {
        if (!shiki)
          return;
        if (!shiki.getLoadedLanguages().includes(lang)) {
          await shiki.loadLanguage(await languageModule());
        }
      }
      async function loadShikiTheme(theme: string, themeModule: any) {
        if (!shiki)
          return;
        if (!shiki.getLoadedThemes().includes(theme)) {
          await shiki.loadTheme(await themeModule());
        }
      }

      const [{ bundledLanguages }, { bundledThemes }]
        = langModule && themeModule
          ? [{ bundledLanguages: langModule }, { bundledThemes: themeModule }]
          : await Promise.all([import('shiki/langs'), import('shiki/themes')]);

      langModule = bundledLanguages;
      themeModule = bundledThemes;

      const themeName = getThemeName(codeTheme);

      if (
        language
        && loadLanguagesRef.current.includes(language)
        && (!themeName || loadThemesRef.current.includes(themeName))
      ) {
        if (!cancelled)
          setReady(true);
        return;
      }

      await Promise.all([
        (async () => {
          if (language) {
            const importFn = (bundledLanguages as any)[language];
            if (!importFn)
              return;
            await loadShikiLanguage(language, importFn);
            loadLanguagesRef.current.push(language);
          }
        })(),
        (async () => {
          if (codeTheme) {
            if (!shiki)
              return;
            if (isThemeString(codeTheme)) {
              const importFn = (bundledThemes as any)[codeTheme];
              if (importFn) {
                await loadShikiTheme(codeTheme, importFn);
                loadThemesRef.current.push(codeTheme);
              }
              return;
            }

            await shiki.loadTheme(codeTheme as any);
            const loadedThemeName = getThemeName(codeTheme);
            if (loadedThemeName && !loadThemesRef.current.includes(loadedThemeName)) {
              loadThemesRef.current.push(loadedThemeName);
            }
          }
        })(),
      ]);

      if (!cancelled)
        setReady(true);
    }

    setReady(false);
    register();
    return () => {
      cancelled = true;
    };
  }, [shiki, codeTheme, language]);

  // Generate HTML and extract background style
  const result = useMemo<{ html: string; bgStyle: string } | null>(() => {
    if (!shiki || !ready || !code)
      return null;

    try {
      const fullHtml = shiki.codeToHtml(code, {
        lang: language!,
        theme: codeTheme as any,
        transformers: shikiTransformers,
      });

      return extractShikiHtml(fullHtml);
    }
    catch {
      return null;
    }
  }, [shiki, code, language, codeTheme, ready]);

  return {
    html: result?.html ?? null,
    bgStyle: result?.bgStyle ?? null,
    isLoading: !ready || !shiki,
  };
}

function isThemeString(theme: CodeTheme): theme is string {
  return typeof theme === 'string';
}

function getThemeName(theme: CodeTheme): string | undefined {
  if (typeof theme === 'string')
    return theme;

  const maybeName = (theme as any)?.name;
  return typeof maybeName === 'string' ? maybeName : undefined;
}
