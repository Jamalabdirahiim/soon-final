import { SVGProps } from 'react';

export function RouterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6.5 14 9 7" />
      <path d="M17.5 14 15 7" />
      <path d="M12 14V7" />
      <path d="M5 10h.01" />
      <path d="M19 10h.01" />
    </svg>
  );
}
