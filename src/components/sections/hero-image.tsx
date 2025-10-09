
"use client";

import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { placeholderImages } from "@/lib/placeholder-images.json";
import HeroImageUploader from "@/components/sections/hero-image-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HeroImageProps {
    heroImageUrl?: string;
    mobileHeroImageUrl?: string;
}

export default function HeroImage({ heroImageUrl, mobileHeroImageUrl }: HeroImageProps) {
  const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
  const isMobile = useIsMobile();

  const getSrc = () => {
    if (isMobile === undefined) return defaultHeroImage?.imageUrl;
    const desktopSrc = heroImageUrl || defaultHeroImage?.imageUrl;
    const mobileSrc = mobileHeroImageUrl || desktopSrc;
    return isMobile ? mobileSrc : desktopSrc;
  };

  const [currentSrc, setCurrentSrc] = useState(getSrc());

  useEffect(() => {
    const newSrc = getSrc();
    if (newSrc) {
        setCurrentSrc(newSrc);
    }
  }, [heroImageUrl, mobileHeroImageUrl, isMobile]);

  return (
    <section id="home" className="relative w-full py-0">
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
      <section className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
              <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl">Hero Section Image</CardTitle>
                      <CardDescription>
                          Update the image for the hero section for the desktop view. Changes are saved instantly.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <HeroImageUploader />
                  </CardContent>
              </Card>
          </div>
      </section>
    </section>
  );
}
