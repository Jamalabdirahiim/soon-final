"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useEffect, useState } from "react";

export default function HeroImage() {
    const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
    const [heroSrc, setHeroSrc] = useState(defaultHeroImage?.imageUrl);

    useEffect(() => {
        const storedHero = localStorage.getItem('heroImage');
        if (storedHero) {
            setHeroSrc(storedHero);
        }

        const handleHeroChange = () => {
            const newHero = localStorage.getItem('heroImage');
            setHeroSrc(newHero || defaultHeroImage?.imageUrl);
        };

        window.addEventListener('heroImageChanged', handleHeroChange);

        return () => {
            window.removeEventListener('heroImageChanged', handleHeroChange);
        };
    }, [defaultHeroImage]);

  return (
    <section id="home" className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center pt-20">
      {heroSrc && (
        <Image
          src={heroSrc}
          alt={defaultHeroImage?.description || 'Hero background image'}
          fill
          priority
          className="object-cover z-0"
          data-ai-hint={defaultHeroImage?.imageHint}
          key={heroSrc}
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
    </section>
  );
}
