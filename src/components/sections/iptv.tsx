
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { content } from "@/lib/content";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { Tv } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Iptv() {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  const firestore = useFirestore();

  const { data: settings } = useDoc(
      firestore ? doc(firestore, 'site-settings', 'config') : null
  );

  const getSrc = () => {
    if (isMobile === undefined) return defaultIptvImage?.imageUrl;
    const featureSrc = settings?.featureImageUrl || defaultIptvImage?.imageUrl;
    const mobileFeatureSrc = settings?.mobileFeatureImageUrl || featureSrc;
    return isMobile ? mobileFeatureSrc : featureSrc;
  };
  
  const [currentSrc, setCurrentSrc] = useState(getSrc());
  
  useEffect(() => {
      const newSrc = getSrc();
      if (newSrc) {
          setCurrentSrc(newSrc);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, isMobile]);


  return (
    <section id="iptv" className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-0 items-center">
          
          <div className="relative z-10 lg:pr-10">
            <Card className="p-8 lg:p-12 shadow-lg">
              <CardContent className="p-0 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  <Tv className="h-4 w-4" />
                  <span>SOON IPTV</span>
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl premium-blue-text">
                  {content.iptv.headline}
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  {content.iptv.subheadline}
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">400+</div>
                  <div className="text-lg text-muted-foreground">Live TV Channels</div>
                </div>
                <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105">
                  <Link href="#contact">Get It Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="relative h-[300px] lg:h-auto lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:translate-x-[5%] xl:translate-x-[10%]">
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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
