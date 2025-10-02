"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SoonLogo({ className }: { className?: string }) {
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
      width={100} 
      height={28}
      priority
      className="h-7 w-auto"
      style={{ filter: 'grayscale(1) brightness(2)' }}
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
