import Image from 'next/image';
import Hero from './components/Hero';
import Social from './components/Social';
import Posts from './components/Posts';

export default function Home() {
  return (
    <main
      className="
        mx-auto
        w-[75ch]
      "
    >
      <Hero />
      <Social />
      <Posts />
    </main>
  );
}
