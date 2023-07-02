import Footer from './components/Footer';
import Header from './components/Header';
import Provider from './components/Provider';
import Plum from './components/Plum';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import './globals.css';

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
    <html lang="en">
      <body className={clsx(inter.className, 'min-h-screen')}>
        <Provider>
          <Header />
          {children}
          <Footer />
          <Plum />
        </Provider>
      </body>
    </html>
  );
}
