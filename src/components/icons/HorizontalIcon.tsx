import type { IconProps } from '.';

export function HorizontalIcon(props: IconProps = {}) {
  return (
    <svg
      className="mx-auto my-16 block h-[10px] w-full max-w-[100px] overflow-visible fill-none stroke-zinc-400/50"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <line
        x1="0"
        y1="0"
        x2="20"
        y2="10"
      />
      <line
        x1="20"
        y1="0"
        x2="40"
        y2="10"
      />
      <line
        x1="40"
        y1="0"
        x2="60"
        y2="10"
      />
      <line
        x1="60"
        y1="0"
        x2="80"
        y2="10"
      />
      <line
        x1="80"
        y1="0"
        x2="100"
        y2="10"
      />
    </svg>
  );
}
