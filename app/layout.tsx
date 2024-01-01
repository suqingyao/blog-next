import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';

import '@/styles/index.css';

import Providers from '@/components/Providers';
import Plum from '@/components/Plum';
import BackTop from '@/components/BackTop';
import Main from '@/components/Main';

import { cn } from '@/lib/utils';
import { sansFont, serifFont } from '@/lib/fonts';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'blog',
  description: `cullyfung's blog`,
  icons: [
    {
      url: '/favicon.svg',
      type: 'image/svg+xml'
    }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          font.className,
          sansFont.variable,
          serifFont.variable,
          'mx-auto max-h-screen w-[75ch] overflow-y-auto bg-[var(--c-bg)]'
        )}
      >
        <NextTopLoader
          color="var(--color-primary)"
          showSpinner={false}
        />
        <Providers>
          <Main>{children}</Main>
          <BackTop />
          <Toaster />
          <Plum />
        </Providers>
      </body>
    </html>
  );
}
