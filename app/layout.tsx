import { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';

import '@/styles/index.css';

import { AppProviders } from '@/providers';
import { PlumContainer } from '@/components/plum-container';
import { AppMain } from '@/components/application';
import { Backtop } from '@/components/backtop';

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
        <AppProviders>
          <AppMain>{children}</AppMain>
          <Backtop />
          <PlumContainer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
