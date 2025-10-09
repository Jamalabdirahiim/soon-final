
"use client";

import React from 'react';
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { content } from "@/lib/content";
import { Fade } from "react-awesome-reveal";
import { IptvImageUploaderDialog } from './iptv-image-uploader-dialog';

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  
  const currentSrc = isMobile
    ? mobileFeatureImageUrl || featureImageUrl || defaultIptvImage?.imageUrl
    : featureImageUrl || defaultIptvImage?.imageUrl;

  const { headline, subheadline } = content.iptv;

  return (
    <section id="iptv" className="bg-secondary py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Fade direction="left" triggerOnce>
                <div className="space-y-6 text-center lg:text-left">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                        {headline}
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        {subheadline}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
                       <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
                         <Link href="#contact">Get IPTV</Link>
                       </Button>
                    </div>
                </div>
              </Fade>
              <Fade direction="right" triggerOnce>
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted relative group">
                        {currentSrc && (
                          <Image
                              id="iptvImageDisplay"
                              src={currentSrc}
                              alt={defaultIptvImage?.description || "IPTV service interface"}
                              fill
                              className="w-full h-full object-cover"
                              data-ai-hint={defaultIptvImage?.imageHint}
                              key={currentSrc}
                          />
                        )}
                        <IptvImageUploaderDialog />
                    </div>
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
