import DarkToggle from './DarkToggle';
import Link from 'next/link';

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
        flex
        items-center
        justify-end
        px-5
        py-6
        text-center
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
