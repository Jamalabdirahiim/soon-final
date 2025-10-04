"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { Server, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function FeatureHighlight() {
  const defaultFeatureImage = placeholderImages.find(p => p.id === 'feature-highlight-image');
  const [featureImageSrc, setFeatureImageSrc] = useState(defaultFeatureImage?.imageUrl);

  useEffect(() => {
    const storedImage = localStorage.getItem('featureImage');
    if (storedImage) {
      setFeatureImageSrc(storedImage);
    }

    const handleImageChange = () => {
      const newImage = localStorage.getItem('featureImage');
      setFeatureImageSrc(newImage || defaultFeatureImage?.imageUrl);
    };

    window.addEventListener('featureImageChanged', handleImageChange);

    return () => {
      window.removeEventListener('featureImageChanged', handleImageChange);
    };
  }, [defaultFeatureImage]);


  return (
    <section id="feature" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
                <h2 className="font-headline text-4xl font-bold tracking-tighter">
                    Investing In Brighter Future
                </h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                    We're investing in our people, our communities, our networks, and a sustainable future. Our focus is on creating a better more connected future for Somalia.
                </p>
            </div>
            <div className="space-y-8">
                <div className="flex gap-4">
                    <Server className="w-8 h-8 text-primary shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Full Network Visibility</h3>
                        <p className="text-muted-foreground mt-1">
                            Credibly syndicate enterprise total linkage whereas cost effective of the art data without multifunctional.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Zap className="w-8 h-8 text-primary shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Resilient Connectivity</h3>
                        <p className="text-muted-foreground mt-1">
                            Synergistically communicate excellent rather than enterprise-wide value quickly architect emerging interfaces.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[#1C2C5B] rounded-lg -skew-y-3 z-0"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center text-white p-8">
                <div className="space-y-4">
                    <h3 className={cn("text-3xl font-bold", "premium-red-text")}>SOO GASHO<br/>FIBER-KA<br/>BLUECOM</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#00AEEF] p-1 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </div>
                            <span className="font-semibold">INTERNET-KA GURYAHA</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="bg-[#00AEEF] p-1 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </div>
                            <span className="font-semibold">INTERNET-KA GANACSIGA</span>
                        </div>
                    </div>
                </div>
                
                {featureImageSrc && (
                <div className="flex justify-center -mb-8">
                    <Image
                        src={featureImageSrc}
                        alt={defaultFeatureImage?.description || 'Feature image'}
                        width={400}
                        height={400}
                        className="object-contain"
                        data-ai-hint="man glasses"
                        key={featureImageSrc}
                    />
                </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
