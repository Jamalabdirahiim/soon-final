
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { Fade } from "react-awesome-reveal";

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const compressImage = (file: File, maxWidth: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // Compress to 80% quality JPEG
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This effect runs only once on the client-side to set the initial image.
    // It prioritizes the locally saved image.
    const savedImage = localStorage.getItem('iptvCustomImage');
    if (savedImage) {
      setCurrentSrc(savedImage);
    } else {
      // Fallback to server-provided images based on device
      const initialSrc = isMobile
        ? mobileFeatureImageUrl || featureImageUrl || defaultIptvImage?.imageUrl
        : featureImageUrl || defaultIptvImage?.imageUrl;
      setCurrentSrc(initialSrc);
    }
  }, [isMobile, featureImageUrl, mobileFeatureImageUrl, defaultIptvImage?.imageUrl]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 1920); // Compress to max 1920px width
        setPreviewSrc(compressedDataUrl);
      } catch (error) {
        console.error("Error compressing image:", error);
        // Optionally, show a toast to the user
      }
    }
  };

  const handleSaveImage = () => {
    if (previewSrc) {
      localStorage.setItem('iptvCustomImage', previewSrc);
      setCurrentSrc(previewSrc);
      setPreviewSrc(null); // Clear preview after saving
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const displaySrc = previewSrc || currentSrc;
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
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button onClick={triggerFileUpload} size="lg" className="premium-red-bg text-white hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
                        IPTV Image Uploader
                      </Button>
                      {previewSrc && (
                        <Button onClick={handleSaveImage} size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
                            Save Image
                        </Button>
                      )}
                    </div>
                </div>
              </Fade>
              <Fade direction="right" triggerOnce>
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                        {displaySrc && (
                        <Image
                            id="iptvImageDisplay"
                            src={displaySrc}
                            alt={defaultIptvImage?.description || "IPTV service interface"}
                            fill
                            className="w-full h-full object-cover"
                            data-ai-hint={defaultIptvImage?.imageHint}
                            key={displaySrc}
                        />
                        )}
                    </div>
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
