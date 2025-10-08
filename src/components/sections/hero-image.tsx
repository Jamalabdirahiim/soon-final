
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroImageProps {
    heroImageUrl?: string;
    mobileHeroImageUrl?: string;
}

export default function HeroImage({ heroImageUrl, mobileHeroImageUrl }: HeroImageProps) {
    const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
    const isMobile = useIsMobile();
    
    // Determine the correct image source
    // On the server (isMobile is undefined), it will prefer the passed prop or fall back to default
    // On the client, it will react to the isMobile hook
    const src = isMobile 
        ? mobileHeroImageUrl 
        : heroImageUrl;

    // Final fallback if no URLs are available
    const finalSrc = src || defaultHeroImage?.imageUrl;

  return (
    <section id="home" className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center">
      {finalSrc && (
        <Image
          src={finalSrc}
          alt={defaultHeroImage?.description || 'Hero background image'}
          fill
          priority
          className="object-cover z-0"
          data-ai-hint={defaultHeroImage?.imageHint}
          key={finalSrc} // Key helps React re-render when src changes
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
    </section>
  );
}
