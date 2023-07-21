import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <Image
        src="/404.svg"
        alt="404 not found"
        fill
        className="animate-floating animate-alternate w-full sm:w-1/2"
      />
    </div>
  );
}
