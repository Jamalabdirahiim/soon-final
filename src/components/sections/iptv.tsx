"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import FadeInWrapper from "@/components/fade-in-wrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getSrc = () => {
    if (isMobile === undefined) return defaultIptvImage?.imageUrl;
    const featureSrc = featureImageUrl || defaultIptvImage?.imageUrl;
    const mobileFeatureSrc = mobileFeatureImageUrl || featureSrc;
    return isMobile ? mobileFeatureSrc : featureSrc;
  };

  const [currentSrc, setCurrentSrc] = useState(getSrc());

  useEffect(() => {
    const newSrc = getSrc();
    if (newSrc) {
      setCurrentSrc(newSrc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureImageUrl, mobileFeatureImageUrl, isMobile]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const newSrc = e.target.result as string;
        setCurrentSrc(newSrc); // Instant preview

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: newSrc }),
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          toast({
            title: "Success!",
            description: "IPTV image updated successfully.",
          });
        } catch (error) {
          console.error("Upload error:", error);
          toast({
            title: "Error",
            description: "Failed to update IPTV image.",
            variant: "destructive",
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="iptv" className="bg-secondary py-12 sm:py-16 lg:py-20">
      <FadeInWrapper>
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-5xl aspect-video">
              {currentSrc && (
                <Image
                  src={currentSrc}
                  alt={defaultIptvImage?.description || "IPTV service interface"}
                  fill
                  className="w-full h-full object-cover rounded-xl shadow-2xl"
                  data-ai-hint={defaultIptvImage?.imageHint}
                  key={currentSrc} // Force re-render on src change
                />
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleButtonClick}
              className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105"
            >
              Change IPTV Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </FadeInWrapper>
    </section>
  );
}
