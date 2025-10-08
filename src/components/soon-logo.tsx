
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function SoonLogo({ className, hasScrolled, logoSrc }: { className?: string; hasScrolled?: boolean, logoSrc: string }) {
  const isMobile = useIsMobile();
  
  return (
    <Link href="/" aria-label="Back to homepage" className={cn("transition-all duration-300", className)}>
      <Image 
        src={logoSrc}
        alt="SOON Logo" 
        width={200}
        height={56}
        priority
        className={cn(
            "h-14 w-auto transition-all duration-300",
            // When not scrolled (i.e., over the hero), make the logo white with a drop shadow.
            !hasScrolled && !isMobile && "brightness-0 invert-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        )}
        key={logoSrc} 
        data-ai-hint="minimalist logo"
      />
    </Link>
  );
}
