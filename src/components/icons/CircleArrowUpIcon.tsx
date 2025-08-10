import type { IconProps } from '.';

export function CircleArrowUpIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        color="currentColor"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
        />
        <path d="M16 13.5s-2.946-3-4-3s-4 3-4 3" />
      </g>
    </svg>
  );
}
