"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function SoonLogo({ className, hasScrolled }: { className?: string; hasScrolled?: boolean }) {
  const [logoSrc, setLogoSrc] = useState('/logo.png');
  const [mobileLogoSrc, setMobileLogoSrc] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleLogoChange = () => {
      const userLogo = localStorage.getItem('userLogo');
      setLogoSrc(userLogo || '/logo.png');
    };
    const handleMobileLogoChange = () => {
      const userMobileLogo = localStorage.getItem('mobileLogo');
      setMobileLogoSrc(userMobileLogo || '');
    };

    handleLogoChange();
    handleMobileLogoChange();

    window.addEventListener('logoChanged', handleLogoChange);
    window.addEventListener('mobileLogoChanged', handleMobileLogoChange);

    return () => {
      window.removeEventListener('logoChanged', handleLogoChange);
      window.removeEventListener('mobileLogoChanged', handleMobileLogoChange);
    };
  }, []);

  const finalSrc = isMobile && mobileLogoSrc ? mobileLogoSrc : logoSrc;

  return (
    <Link href="/" aria-label="Back to homepage" className={cn("transition-all duration-300", className)}>
      <Image 
        src={finalSrc}
        alt="SOON Logo" 
        width={200} 
        height={56}
        priority
        className={cn(
            "h-14 w-auto transition-all duration-300",
            !hasScrolled && !isMobile
                ? "brightness-0 invert-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                : "",
             isMobile && "brightness-100 invert-0"
        )}
        key={finalSrc}
        data-ai-hint="minimalist logo"
      />
    </Link>
  );
}
