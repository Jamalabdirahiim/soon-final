
'use client';

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

interface IptvHeroProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const IptvHero = ({ featureImageUrl, mobileFeatureImageUrl }: IptvHeroProps) => {
    const isMobile = useIsMobile();

    const getSrc = () => {
        // Since we check for isMobile === undefined for loading, we don't need a separate default image here.
        if (isMobile === undefined) return null; 
        
        const desktopSrc = featureImageUrl;
        const mobileSrc = mobileFeatureImageUrl || desktopSrc;
        
        return isMobile ? mobileSrc : desktopSrc;
    };

    const imageUrl = getSrc();

    // Loading state while useIsMobile is resolving
    if (isMobile === undefined) {
        return (
            <section className="flex flex-col items-center">
                <Skeleton className="w-full h-[80vh] rounded-xl" />
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center" id="iptv">
            <div className="w-full h-[80vh] relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="IPTV Service Showcase"
                        fill
                        className="object-contain w-full h-full"
                        key={imageUrl}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-16 w-16" />
                        <h3 className="mt-4 text-lg font-semibold">IPTV Image Not Set</h3>
                        <p className="mt-2 text-sm">Please upload an image in the customization panel.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default IptvHero;
