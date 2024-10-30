import '@/styles/main.css';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

import { AppContent } from '@/components/application';
import { Backtop } from '@/components/ui/backtop';
import { PlumContainer } from '@/components/plum-container';
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
          'min-h-screen w-full bg-neutral-50 text-zinc-200'
        )}
      >
        <NextTopLoader
          color="var(--theme-color)"
          showSpinner={false}
        />
        <AppProviders>
          <AppContent>{children}</AppContent>
          <Backtop />
          <Toaster />
          <Analytics />
          <PlumContainer />
        </AppProviders>
      </body>
    </html>
  );
}
