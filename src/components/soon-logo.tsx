
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

  const { data: settings } = useDoc(
    firestore ? doc(firestore, 'site-settings', 'logo') : null
  );
  
  const { data: mobileSettings } = useDoc(
    firestore ? doc(firestore, 'site-settings', 'config') : null
  );

  const logoSrc = settings?.url || '/logo.png';
  const mobileLogoSrc = mobileSettings?.mobileLogoUrl || '';

  const finalSrc = isMobile && mobileLogoSrc ? mobileLogoSrc : logoSrc;
  const isScrolledOrMobile = hasScrolled || isMobile;

  return (
    <Link href="/" aria-label="Back to homepage" className={cn("transition-all duration-300", className)}>
      <Image 
        src={finalSrc}
        alt="SOON Logo" 
        width={isMobile && mobileLogoSrc ? 150 : 200}
        height={isMobile && mobileLogoSrc ? 42 : 56}
        priority
        className={cn(
            "h-auto transition-all duration-300",
            isMobile && mobileLogoSrc ? "w-[150px]" : "h-14 w-auto",
            !isScrolledOrMobile
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
