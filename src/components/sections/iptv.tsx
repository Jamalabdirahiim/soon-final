
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { content } from "@/lib/content";
import { Fade } from "react-awesome-reveal";

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

// Helper function to resize and compress image
const resizeAndCompressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  
  const [currentSrc, setCurrentSrc] = useState<string | undefined | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('iptvCustomImage');
    if (savedImage) {
      setCurrentSrc(savedImage);
    } else {
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
        const compressedDataUrl = await resizeAndCompressImage(file);
        setPreviewSrc(compressedDataUrl);
      } catch (error) {
        console.error("Error processing image:", error);
        // Handle error (e.g., show a toast to the user)
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

  const triggerImageUpload = () => {
    imageUploadInputRef.current?.click();
  };

  const { headline, subheadline } = content.iptv;

  const displaySrc = previewSrc || currentSrc;

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
                     <input
                      type="file"
                      id="imageUploadInput"
                      ref={imageUploadInputRef}
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        id="imageUploadButton"
                        onClick={triggerImageUpload}
                        className="premium-red-bg text-white"
                      >
                        IPTV Image Uploader
                      </Button>
                      {previewSrc && (
                        <Button onClick={handleSaveImage} className="premium-blue-bg text-white">
                          Save Image
                        </Button>
                      )}
                    </div>
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
