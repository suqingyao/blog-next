import { Inter } from 'next/font/google';
import clsx from 'clsx';
import './styles/globals.css';
import './styles/prose.css';
import Header from './components/Header';
import Footer from './components/Footer';
import NextProgress from './components/NextProgress';
import Providers from './components/Providers';
import Plum from './components/Plum';
import BackTop from './components/BackTop';

const inter = Inter({ subsets: ['latin'] });

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
      <body
        className={clsx(
          inter.className,
          'mx-auto min-h-screen w-[75ch] bg-white dark:bg-black'
        )}
      >
        <NextProgress
          color="#fb7299"
          options={{ showSpinner: false }}
        />
        <Providers>
          <Header />
          <div className="h-full pt-[60px]">
            <div className="min-h-[calc(100%-60px)]">{children}</div>
            <Footer />
          </div>
          <BackTop />
        </Providers>
        <Plum />
      </body>
    </html>
  );
}
