
"use client";

import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroImageProps {
    heroImageUrl?: string;
    mobileHeroImageUrl?: string;
}

// Default placeholder image in case nothing is provided from the server.
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzYxMDkyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function HeroImage({ heroImageUrl, mobileHeroImageUrl }: HeroImageProps) {
  const isMobile = useIsMobile();

  // This function determines the correct image source to display.
  // It prioritizes the mobile-specific image on mobile devices,
  // then falls back to the desktop image, and finally to a static placeholder.
  const getSrc = () => {
    // On the server or before the mobile check has run, we can't know the screen size.
    // Default to the desktop URL if available, otherwise the fallback.
    if (isMobile === undefined) {
      return heroImageUrl || FALLBACK_IMAGE;
    }

    const desktopSrc = heroImageUrl || FALLBACK_IMAGE;
    const mobileSrc = mobileHeroImageUrl || desktopSrc; // Mobile falls back to desktop image
    
    return isMobile ? mobileSrc : desktopSrc;
  };

  const currentSrc = getSrc();

  return (
    <section id="home" className="relative w-full py-0 -mt-20">
      <div className="relative w-full h-[60vh] md:h-[100vh] overflow-hidden">
          {currentSrc && (
            <Image
                src={currentSrc}
                alt={"High-speed internet concept"}
                fill
                className="w-full h-full object-cover"
                priority
                data-ai-hint={"abstract technology"}
                key={currentSrc}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
           <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-2xl">
                    Experience the Future of Internet & TV.
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200 md:text-xl drop-shadow-lg">
                    Blazing-fast fiber optic internet and over 400+ IPTV channels. Get the most reliable connection for your home and business with SOON.
                </p>
            </div>
          </div>
      </div>
    </section>
  );
}
