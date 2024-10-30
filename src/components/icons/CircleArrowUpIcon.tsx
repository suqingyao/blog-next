import { IconProps } from '.';

export const CircleArrowUpIcon = (props: IconProps) => {
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
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
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
};
