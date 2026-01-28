import type { StringLiteralUnion, ThemeRegistrationAny } from '@shikijs/types';

export type CodeTheme = ThemeRegistrationAny | StringLiteralUnion<any>;

export interface ShikiCodeProps {
  code: string;
  language?: string;
  codeTheme?: CodeTheme;
}

/**
 * Result from useShiki hook
 */
export interface ShikiResult {
  /** HTML content (spans inside code tag) */
  innerHTML: string;
  /** Background style with CSS variables for light/dark themes */
  bgStyle: string;
}
