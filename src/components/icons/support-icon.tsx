import { SVGProps } from 'react';

export function SupportIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 18V9.38A6.38 6.38 0 0 1 12 3a6.38 6.38 0 0 1 3 11.62V18" />
      <path d="M12 3a6.38 6.38 0 0 0-3 11.62" />
      <path d="M15 11.62A6.38 6.38 0 0 0 12 3" />
      <path d="M6 21h12" />
      <path d="M12 18h.01" />
    </svg>
  );
}
