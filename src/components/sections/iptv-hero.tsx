
"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { placeholderImages } from "@/lib/placeholder-images.json";

interface IptvHeroProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const IptvHero = ({ featureImageUrl, mobileFeatureImageUrl }: IptvHeroProps) => {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  
  const getSrc = () => {
    if (isMobile === undefined) return defaultIptvImage?.imageUrl;
    const desktopSrc = featureImageUrl || defaultIptvImage?.imageUrl;
    const mobileSrc = mobileFeatureImageUrl || desktopSrc;
    return isMobile ? mobileSrc : desktopSrc;
  };
  
  const currentSrc = getSrc();

  return (
    <section id="iptv" className="relative flex items-center justify-center w-full h-[80vh] bg-black overflow-hidden">
      {currentSrc && (
        <Image
          src={currentSrc}
          alt={defaultIptvImage?.description || "IPTV service interface"}
          fill
          className="object-cover w-full h-full"
          data-ai-hint={defaultIptvImage?.imageHint}
          key={currentSrc}
        />
      )}
    </section>
  );
};

export default IptvHero;
