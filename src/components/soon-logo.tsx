
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';

export function SoonLogo({ className, hasScrolled }: { className?: string; hasScrolled?: boolean }) {
  const isMobile = useIsMobile();
  const firestore = useFirestore();
  const defaultLogoPath = '/logo.svg';
  
  const [logoKey, setLogoKey] = useState(Date.now());
  const [logoSrc, setLogoSrc] = useState(defaultLogoPath);

  // The key option in useDoc forces a re-fetch when the key changes.
  const { data: settings } = useDoc(
    firestore ? doc(firestore, 'site-settings', 'logo') : null,
    { key: logoKey } 
  );

  // Listen for the custom event to update the logo
  useEffect(() => {
    const handleLogoChange = () => {
      setLogoKey(Date.now());
    };
    window.addEventListener('logoChanged', handleLogoChange);
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange);
    };
  }, []);

  useEffect(() => {
    if (settings?.url) {
      setLogoSrc(settings.url);
    } else {
      setLogoSrc(defaultLogoPath);
    }
  }, [settings]);

  const isScrolledOrMobile = hasScrolled || isMobile;
  const isDataUrl = logoSrc.startsWith('data:image');

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
            !isScrolledOrMobile && !isDataUrl
                ? "brightness-0 invert-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                : "",
             isMobile && "brightness-100 invert-0",
             // This style should only apply if there IS a custom logo, to make it white.
             !isScrolledOrMobile && logoSrc && !isDataUrl && "brightness-0 invert-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
             // if it's a data URL, we don't apply the filter when not scrolled
             !isScrolledOrMobile && isDataUrl && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        )}
        key={logoSrc} 
        data-ai-hint="minimalist logo"
      />
    </Link>
  );
}
