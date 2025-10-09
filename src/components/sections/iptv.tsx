
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import FadeInWrapper from "@/components/fade-in-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { content } from "@/lib/content";

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();

  const getSrc = () => {
    if (isMobile === undefined) return defaultIptvImage?.imageUrl;
    const desktopSrc = featureImageUrl || defaultIptvImage?.imageUrl;
    const mobileSrc = mobileFeatureImageUrl || desktopSrc;
    return isMobile ? mobileSrc : desktopSrc;
  };

  const currentSrc = getSrc();
  const { headline, subheadline } = content.iptv;

  return (
    <section id="iptv" className="bg-secondary py-12 sm:py-16 lg:py-20">
      <FadeInWrapper>
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4 text-center lg:text-left">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                        {headline}
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        {subheadline}
                    </p>
                    <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg mt-4">
                        <Link href="#contact">Learn More</Link>
                    </Button>
                </div>
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none aspect-[16/10]">
                  {currentSrc && (
                    <Image
                      src={currentSrc}
                      alt={defaultIptvImage?.description || "IPTV service interface"}
                      fill
                      className="w-full h-full object-cover rounded-xl shadow-2xl"
                      data-ai-hint={defaultIptvImage?.imageHint}
                      key={currentSrc}
                    />
                  )}
                </div>
            </div>
        </div>
      </FadeInWrapper>
    </section>
  );
}
