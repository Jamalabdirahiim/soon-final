"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function HeroImage() {
    const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
    const isMobile = useIsMobile();
    const firestore = useFirestore();

    const { data: settings } = useDoc(
        firestore ? doc(firestore, 'site-settings', 'config') : null
    );

    const heroSrc = settings?.heroImageUrl || defaultHeroImage?.imageUrl;
    const mobileHeroSrc = settings?.mobileHeroImageUrl || '';
    
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
