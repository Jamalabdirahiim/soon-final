"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  const content = (
    <Image 
      src={logoSrc}
      alt="SOON Logo" 
      width={200} 
      height={56}
      priority
      className="h-14 w-auto"
      style={{ filter: hasScrolled ? 'none' : 'grayscale(1) brightness(100)' }}
      key={logoSrc} // Add key to force re-render on src change
      data-ai-hint="minimalist logo"
    />
  );

  return (
    <Link href="/" aria-label="Back to homepage" className={className}>
      {content}
    </Link>
  );
}
