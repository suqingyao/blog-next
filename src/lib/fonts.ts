import { Inter, Manrope, Noto_Serif_SC, Outfit } from 'next/font/google';
import localFont from 'next/font/local';

const sansFont = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const serifFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  // adjustFontFallback: false,
  fallback: ['Noto Serif SC'],
});

const monoFont = Outfit({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

const interFont = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const snProFont = localFont({
  variable: '--font-fans',
  preload: false,
  src: [
    {
      path: '../font/SNPro-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../font/SNPro-ThinItalic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../font/SNPro-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../font/SNPro-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../font/SNPro-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/SNPro-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../font/SNPro-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../font/SNPro-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../font/SNPro-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../font/SNPro-SemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../font/SNPro-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../font/SNPro-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
});

export { interFont, monoFont, sansFont, serifFont, snProFont };
