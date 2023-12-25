import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';

import '@/styles/index.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import Plum from '@/components/Plum';
import BackTop from '@/components/BackTop';

import { cn } from '@/lib/utils';

const font = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'blog',
  description: `cullyfung's blog`
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
      <Head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
      </Head>
      <body
        className={cn(
          font.className,
          'mx-auto min-h-screen w-[75ch] bg-white dark:bg-black'
        )}
      >
        <NextTopLoader
          color="#22c55e"
          showSpinner={false}
        />
        <Providers>
          <Header />
          <div className="h-full pt-[60px]">
            <div className="min-h-[calc(100%-60px)]">{children}</div>
            <Footer />
          </div>
          <BackTop />
          <Toaster />
        </Providers>
        <Plum />
      </body>
    </html>
  );
}
