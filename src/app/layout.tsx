import '@/styles/main.css';
import { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

import { AppContent } from '@/components/application';
import { Backtop } from '@/components/ui/backtop';
import { PlumContainer } from '@/components/plum-container';
import { AppContextProvider } from '@/contexts';
import { AppProviders } from '@/providers';

import { interFont, monoFont, sansFont, serifFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { APP_DESCRIPTION, APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: [
    {
      url: '/avatar.png',
      type: 'image/png'
    }
  ]
};

export default function RootLayout({
  children,
  modal
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
          'min-h-screen w-full'
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
        </AppProviders>
      </body>
    </html>
  );
}
