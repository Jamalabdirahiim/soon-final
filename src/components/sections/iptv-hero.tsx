
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
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full h-[80vh] rounded-xl">
        {currentSrc && (
            <Image
                src={currentSrc}
                alt={"IPTV service hero image"}
                fill
                className="object-contain w-full h-full rounded-xl"
                key={currentSrc} // Force re-render when src changes
            />
        )}
      </div>
    </div>
  );
};

export default IptvHero;
