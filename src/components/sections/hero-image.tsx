"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HeroImage() {
    const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
    const [heroSrc, setHeroSrc] = useState(defaultHeroImage?.imageUrl);
    const [mobileHeroSrc, setMobileHeroSrc] = useState('');
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleHeroChange = () => {
            const newHero = localStorage.getItem('heroImage');
            setHeroSrc(newHero || defaultHeroImage?.imageUrl);
        };

        const handleMobileHeroChange = () => {
            const newMobileHero = localStorage.getItem('mobileHeroImage');
            setMobileHeroSrc(newMobileHero || '');
        };

        handleHeroChange();
        handleMobileHeroChange();

        window.addEventListener('heroImageChanged', handleHeroChange);
        window.addEventListener('mobileHeroImageChanged', handleMobileHeroChange);

        return () => {
            window.removeEventListener('heroImageChanged', handleHeroChange);
            window.removeEventListener('mobileHeroImageChanged', handleMobileHeroChange);
        };
    }, [defaultHeroImage]);

    const finalSrc = isMobile && mobileHeroSrc ? mobileHeroSrc : heroSrc;

  return (
    <section id="home" className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center pt-20">
      {finalSrc && (
        <Image
          src={finalSrc}
          alt={defaultHeroImage?.description || 'Hero background image'}
          fill
          priority
          className="object-cover z-0"
          data-ai-hint={defaultHeroImage?.imageHint}
          key={finalSrc}
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
    </section>
  );
}
