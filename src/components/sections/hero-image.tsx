
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    const { headline, subheadline } = content.hero;


  return (
    <section id="home" className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center pt-20">
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
      <div className="relative z-20 container mx-auto px-4 text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90 md:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105">
            <Link href="#pricing">View Plans</Link>
          </Button>
           <Button asChild size="lg" variant="outline-white" className="transition-transform hover:scale-105">
            <Link href="#iptv">Explore IPTV</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
