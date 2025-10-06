
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function SoonLogo({ className, hasScrolled }: { className?: string; hasScrolled?: boolean }) {
  const isMobile = useIsMobile();
  const firestore = useFirestore();

  const { data: settings, loading: logoLoading } = useDoc(
    firestore ? doc(firestore, 'site-settings', 'logo') : null
  );
  
  const { data: mobileSettings, loading: mobileLogoLoading } = useDoc(
    firestore ? doc(firestore, 'site-settings', 'config') : null
  );

  const logoSrc = settings?.url;
  const mobileLogoSrc = mobileSettings?.mobileLogoUrl;

  const finalSrc = isMobile && mobileLogoSrc ? mobileLogoSrc : logoSrc;
  const isScrolledOrMobile = hasScrolled || isMobile;

  const isLoading = logoLoading || mobileLogoLoading;

  if (isLoading) {
    return (
        <div className={cn("transition-all duration-300", className)}>
            <div className={cn(
                "bg-gray-300 animate-pulse",
                isMobile ? "w-[150px] h-[42px]" : "w-[200px] h-[56px]",
                !isScrolledOrMobile ? "bg-white/50" : "",
            )} />
        </div>
    );
  }

  return (
    <Link href="/" aria-label="Back to homepage" className={cn("transition-all duration-300", className)}>
      <Image 
        src={finalSrc || '/logo.png'}
        alt="SOON Logo" 
        width={isMobile && mobileLogoSrc ? 150 : 200}
        height={isMobile && mobileLogoSrc ? 42 : 56}
        priority
        className={cn(
            "h-auto transition-all duration-300",
            isMobile && mobileLogoSrc ? "w-[150px]" : "h-14 w-auto",
            !isScrolledOrMobile && !finalSrc
                ? "brightness-0 invert-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                : "",
             isMobile && "brightness-100 invert-0",
             !isScrolledOrMobile && finalSrc && "brightness-0 invert-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"

        )}
        key={finalSrc || '/logo.png'}
        data-ai-hint="minimalist logo"
      />
    </Link>
  );
}
