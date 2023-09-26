import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-10 text-xl text-[#555]">
        Sorry, the requested post does not exist.
      </p>
      <Link href="/" className="mt-20 text-xs underline opacity-50">
        Back to Home
      </Link>
    </div>
  );
}
