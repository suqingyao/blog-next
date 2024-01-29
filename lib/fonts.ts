import { Manrope, Noto_Serif_SC, Gaegu } from 'next/font/google';

const sansFont = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap'
});

const serifFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
  // adjustFontFallback: false,
  fallback: ['Noto Serif SC']
});

const proseFont = Gaegu({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-prose',
  display: 'swap'
});

export { sansFont, serifFont, proseFont };
