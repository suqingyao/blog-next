import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { AppContent } from '@/components/application';

import { MusicPlayer } from '@/components/music-player';
import { PlumContainer } from '@/components/plum-container';
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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
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
          <PlumContainer />
          <MusicPlayer />
        </AppProviders>
      </body>
    </html>
  );
}
