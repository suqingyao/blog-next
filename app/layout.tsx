import { Inter } from 'next/font/google';
import clsx from 'clsx';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import NextProgressbar from './components/NextProgressbar';
import ConfigProvider from './components/ConfigProvider';

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
        <NextProgressbar color="#fb7299" options={{ showSpinner: false }} />
        <Header />
        <ConfigProvider attribute="class">{children}</ConfigProvider>
        <Footer />
      </body>
    </html>
  );
}
