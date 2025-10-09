
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { placeholderImages } from "@/lib/placeholder-images.json";
import { Camera } from 'lucide-react';
import { useUser } from '@/firebase';

interface IptvHeroProps {
    featureImageUrl?: string;
    mobileFeatureImageUrl?: string;
}

const IptvHero = ({ featureImageUrl, mobileFeatureImageUrl }: IptvHeroProps) => {
  const { user } = useUser();
  const isMobile = useIsMobile();

  const getSrc = () => {
    const defaultImage = placeholderImages.find(p => p.id === 'iptv-hero');
    if (isMobile === undefined) return defaultImage?.imageUrl;

    const desktopSrc = featureImageUrl || defaultImage?.imageUrl;
    const mobileSrc = mobileFeatureImageUrl || desktopSrc;
    return isMobile ? mobileSrc : desktopSrc;
  };
  
  const currentSrc = getSrc();

  return (
    <section className="flex flex-col items-center" id="iptv">
        <div className="w-full h-[80vh] relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
            {currentSrc ? (
                <Image
                    src={currentSrc}
                    alt="IPTV Service Showcase"
                    fill
                    className="object-contain w-full h-full"
                    priority
                    key={currentSrc} 
                />
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">IPTV Image Not Set</h3>
                    <p className="mt-1 text-sm text-gray-500">An admin can upload an image in the customization panel.</p>
                </div>
            )}
        </div>
    </section>
  );
};

export default IptvHero;
