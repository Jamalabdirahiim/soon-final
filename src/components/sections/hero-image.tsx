
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface HeroImageProps {
    heroImageUrl?: string;
    mobileHeroImageUrl?: string;
}

export default function HeroImage({ heroImageUrl, mobileHeroImageUrl }: HeroImageProps) {
    const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
    const isMobile = useIsMobile();
    
    const src = isMobile 
        ? mobileHeroImageUrl 
        : heroImageUrl;

    const finalSrc = src || defaultHeroImage?.imageUrl;

    const { headline, subheadline } = content.hero;

    return (
        <section id="home" className="relative w-full h-[85vh] min-h-[550px] md:h-screen flex items-center justify-center text-center text-primary-foreground overflow-hidden">
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

            <div className="relative z-20 container mx-auto px-4">
                <Fade triggerOnce direction="up" cascade damping={0.2}>
                    <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md">
                        {headline}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-primary-foreground/90 md:text-xl drop-shadow-sm">
                        {subheadline}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="premium-red-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
                            <Link href="#pricing">View Plans</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline-white" className="transition-transform hover:scale-105 backdrop-blur-sm bg-white/10">
                            <Link href="#iptv">Explore IPTV</Link>
                        </Button>
                    </div>
                </Fade>
            </div>
        </section>
    );
}
