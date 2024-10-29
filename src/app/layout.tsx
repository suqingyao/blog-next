import '@/styles/main.css';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

import { Content } from '@/components/application';
import { Backtop } from '@/components/ui/backtop';
import { AppProviders } from '@/providers';

import { sansFont, serifFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'suqingyao',
  description: `suqingyao's blog`,
  icons: [
    {
      url: '/avatar.png',
      type: 'image/png'
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
          'h-full min-h-screen w-full overflow-y-auto bg-[var(--c-bg)]'
        )}
      >
        <NextTopLoader
          color="var(--theme-color)"
          showSpinner={false}
        />
        <AppProviders>
          <Content>{children}</Content>
          <Backtop />
          <Toaster />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
