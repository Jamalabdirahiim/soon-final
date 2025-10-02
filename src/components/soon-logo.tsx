"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function SoonLogo({ className, hasScrolled }: { className?: string; hasScrolled?: boolean }) {
  const [logoSrc, setLogoSrc] = useState('/logo.png');

  useEffect(() => {
    // Check for a user-uploaded logo in local storage on mount
    const userLogo = localStorage.getItem('userLogo');
    if (userLogo) {
      setLogoSrc(userLogo);
    }

    // Listen for the logoChanged event to update in real-time
    const handleLogoChange = () => {
      const newUserLogo = localStorage.getItem('userLogo');
      setLogoSrc(newUserLogo || '/logo.png');
    };

    window.addEventListener('logoChanged', handleLogoChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange);
    };
  }, []);

  return (
    <Link href="/" aria-label="Back to homepage" className={cn("transition-all duration-300", !hasScrolled && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]", className)}>
      <Image 
        src={logoSrc}
        alt="SOON Logo" 
        width={200} 
        height={56}
        priority
        className="h-14 w-auto"
        key={logoSrc} // Add key to force re-render on src change
        data-ai-hint="minimalist logo"
      />
    </Link>
  );
}
