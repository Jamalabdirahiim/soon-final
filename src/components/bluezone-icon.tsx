import React from 'react';

export function BluezoneIcon() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#00AEEF] p-1 rounded-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <span className="font-bold text-lg">INTERNETKA GURYAHA</span>
    </div>
  );
}
