import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { AppContent } from '@/components/application';
import { DotGrid } from '@/components/common/DotGrid';

import { MusicPlayer } from '@/components/music-player';
import { Backtop } from '@/components/ui/backtop';
import { APP_DESCRIPTION, APP_NAME, OUR_DOMAIN } from '@/constants';
import { AppContextProvider } from '@/contexts';

import { interFont, monoFont, sansFont, serifFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { AppProviders } from '@/providers';
import '@/styles/main.css';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: [
    {
      url: '/avatar.png',
      type: 'image/png',
    },
  ],
  alternates: {
    types: {
      'application/rss+xml': `${OUR_DOMAIN || 'https://localhost:2323'}/api/feed`,
    },
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          sansFont.variable,
          serifFont.variable,
          monoFont.variable,
          interFont.variable,
          'min-h-screen w-full',
        )}
      >
        <div style={{ width: '100%', height: '100%', position: 'fixed', inset: 0, zIndex: -1 }}>
          <DotGrid
            dotSize={2}
            gap={40}
            baseColor="#e5e7eb"
            activeColor="#a1a1aa"
            proximity={100}
            shockRadius={100}
            shockStrength={2}
            resistance={1000}
            returnDuration={1}
          />
        </div>
        <NextTopLoader
          color="var(--color-primary)"
          showSpinner={false}
        />
        <AppProviders>
          <AppContextProvider>
            <AppContent>
              {children}
              {modal}
            </AppContent>
          </AppContextProvider>
          <Backtop />
          <Toaster />
          <MusicPlayer />
        </AppProviders>
      </body>
    </html>
  );
}
