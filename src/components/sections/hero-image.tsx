
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useEffect, useState } from "react";

export default function HeroImage() {
    const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
    const defaultMobileHeroImage = placeholderImages.find(p => p.id === 'mobile-hero-background');
    
    const isMobile = useIsMobile();
    const firestore = useFirestore();

    const [heroImageKey, setHeroImageKey] = useState(Date.now());

    const { data: settings } = useDoc(
        firestore ? doc(firestore, 'site-settings', 'config') : null,
        { key: heroImageKey }
    );
    
    const getSrc = () => {
        if (isMobile === undefined) return defaultHeroImage?.imageUrl; // Return default for server render
        const heroSrc = settings?.heroImageUrl || defaultHeroImage?.imageUrl;
        const mobileHeroSrc = settings?.mobileHeroImageUrl || defaultMobileHeroImage?.imageUrl || heroSrc;
        return isMobile ? mobileHeroSrc : heroSrc;
    }
    
    const [currentSrc, setCurrentSrc] = useState(getSrc());

    useEffect(() => {
        const handleImageChange = () => {
          setHeroImageKey(Date.now());
        };
        window.addEventListener('heroImageChanged', handleImageChange);
        return () => {
          window.removeEventListener('heroImageChanged', handleImageChange);
        };
    }, []);

    useEffect(() => {
        const newSrc = getSrc();
        if (newSrc) {
            setCurrentSrc(newSrc);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings, isMobile]);

  return (
    <section id="home" className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center pt-20">
      {currentSrc && (
        <Image
          src={currentSrc}
          alt={defaultHeroImage?.description || 'Hero background image'}
          fill
          priority
          className="object-cover z-0"
          data-ai-hint={defaultHeroImage?.imageHint}
          key={currentSrc}
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
    </section>
  );
}
