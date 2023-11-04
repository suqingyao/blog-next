import Link from 'next/link';
import dynamic from 'next/dynamic';

const DarkToggle = dynamic(() => import('./DarkToggle'), { ssr: false });

export default function Header() {
  const links = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Posts',
      path: '/posts'
    }
  ];

  return (
    <div
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-[60px]
        w-full
        items-center
        justify-end
        px-5
        text-center
        shadow-sm
        backdrop-blur-sm
      "
    >
      {links.map((link) => (
        <Link
          href={`${link.path}`}
          key={link.path}
          className="mx-2 cursor-pointer hover:font-semibold hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
      <DarkToggle />
    </div>
  );
}
