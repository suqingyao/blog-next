import { Inter } from 'next/font/google';
import clsx from 'clsx';
import './styles/globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import NextProgress from './components/NextProgress';
import Providers from './components/Providers';

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
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(inter.className, 'mx-auto min-h-screen w-[75ch]')}>
        <NextProgress color="#fb7299" options={{ showSpinner: false }} />
        <Providers>
          <Header />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
