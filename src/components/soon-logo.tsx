
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SoonLogo({ className, logoSrc, isInFooter }: { className?: string; logoSrc: string, isInFooter?: boolean }) {

  if (!logoSrc) return null;

  return (
    <Link href="/" aria-label="Back to homepage" className="flex items-center">
      <Image 
        src={logoSrc}
        alt="SOON Logo" 
        width={200}
        height={56}
        priority
        className={cn(
            "h-14 w-auto transition-all duration-300",
            isInFooter && "brightness-0 invert",
            className
        )}
        key={logoSrc} 
        data-ai-hint="minimalist logo"
      />
    </Link>
  );
}
