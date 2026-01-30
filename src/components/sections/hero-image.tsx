
"use client";

import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Fade } from 'react-awesome-reveal';
import { content } from '@/lib/content';

interface HeroImageProps {
  heroImageUrl?: string;
  mobileHeroImageUrl?: string;
}

const FALLBACK_IMAGE = "/hero-fiber-blue.png";

export default function HeroImage({ heroImageUrl, mobileHeroImageUrl }: HeroImageProps) {
  const isMobile = useIsMobile();
  const { headline, subheadline } = content.hero;

  const getSrc = () => {
    if (isMobile === undefined) {
      return heroImageUrl || FALLBACK_IMAGE;
    }

    const desktopSrc = heroImageUrl || FALLBACK_IMAGE;
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
            alt={"High-speed internet concept"}
            fill
            className="w-full h-full object-cover"
            priority
            data-ai-hint={"abstract technology"}
            key={currentSrc}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
        <div className={cn(
          "absolute inset-0 flex items-center justify-center pt-24 md:pt-0"
        )}>
          <div className="container mx-auto px-0 text-center">
            <Fade direction="up" cascade damping={0.2} triggerOnce>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-2xl">
                {headline}
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200 md:text-xl drop-shadow-lg">
                {subheadline}
              </p>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
