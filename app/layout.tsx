import { Inter } from 'next/font/google';
import clsx from 'clsx';
import './globals.css';
import AppMain from './components/AppMain';

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
      <body className={clsx(inter.className, 'min-h-screen')}>
        <AppMain>{children}</AppMain>
      </body>
    </html>
  );
}
