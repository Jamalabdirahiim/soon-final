"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Zap, CheckCircle } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useState, useEffect } from "react";

export default function FeatureHighlight() {
  const defaultFeatureImage = placeholderImages.find(p => p.id === 'feature-highlight-image');
  const [featureSrc, setFeatureSrc] = useState(defaultFeatureImage?.imageUrl);

  useEffect(() => {
    const storedImage = localStorage.getItem('featureImage');
    if (storedImage) {
      setFeatureSrc(storedImage);
    }

    const handleImageChange = () => {
      const newImage = localStorage.getItem('featureImage');
      setFeatureSrc(newImage || defaultFeatureImage?.imageUrl);
    };

    window.addEventListener('featureImageChanged', handleImageChange);

    return () => {
      window.removeEventListener('featureImageChanged', handleImageChange);
    };
  }, [defaultFeatureImage]);


  return (
    <section id="feature" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="lg:order-2 flex items-center justify-center">
            {featureSrc && (
              <Card className="overflow-hidden shadow-lg rounded-xl">
                <Image
                  src={featureSrc}
                  alt={defaultFeatureImage?.description || 'Feature highlight image'}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  data-ai-hint={defaultFeatureImage?.imageHint}
                  key={featureSrc}
                />
              </Card>
            )}
          </div>
          <div className="lg:order-1 space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Feature</div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Always-On Connection
              </h2>
            </div>
            <p className="text-muted-foreground md:text-lg">
              Our modern network is built to be stable and reliable. Say goodbye to buffering and dropped connections. Whether you're on a video call, streaming a movie, or gaming, SOON provides a smooth online experience.
            </p>
            <ul className="grid gap-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    99.9% Uptime
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Low-Lag for Gaming & Calls
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Weather-Proof Fiber Lines
                </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
