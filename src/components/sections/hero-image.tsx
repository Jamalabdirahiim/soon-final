
"use client";

import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { placeholderImages } from "@/lib/placeholder-images.json";

interface HeroImageProps {
    heroImageUrl?: string;
    mobileHeroImageUrl?: string;
}

export default function HeroImage({ heroImageUrl, mobileHeroImageUrl }: HeroImageProps) {
  const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
  const isMobile = useIsMobile();

  const getSrc = () => {
    // Return a placeholder if we're on the server and can't determine mobile status
    if (isMobile === undefined) return defaultHeroImage?.imageUrl;

    const desktopSrc = heroImageUrl || defaultHeroImage?.imageUrl;
    const mobileSrc = mobileHeroImageUrl || desktopSrc;
    return isMobile ? mobileSrc : desktopSrc;
  };

  const currentSrc = getSrc();

  return (
    <section id="home" className="relative w-full py-0 -mt-20">
      <div className="relative w-full h-[60vh] md:h-[100vh] overflow-hidden">
          {currentSrc && (
            <Image
                src={currentSrc}
                alt={defaultHeroImage?.description || "High-speed internet concept"}
                fill
                className="w-full h-full object-cover"
                priority
                data-ai-hint={defaultHeroImage?.imageHint}
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
