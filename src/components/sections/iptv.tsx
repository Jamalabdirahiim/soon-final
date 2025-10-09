
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { Fade } from "react-awesome-reveal";
import { cn } from '@/lib/utils';

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

// Function to resize image using a canvas
const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result !== 'string') {
        return reject(new Error('Failed to read file.'));
      }
      img.src = e.target.result;
    };

    img.onload = () => {
      let { width, height } = img;
      const ratio = width / height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / ratio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context.'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      // Use a slightly higher quality for webp to balance size and quality
      resolve(canvas.toDataURL('image/webp', 0.9));
    };

    img.onerror = (err) => reject(err);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};


export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  
  const [currentSrc, setCurrentSrc] = useState(featureImageUrl || defaultIptvImage?.imageUrl);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to load saved image from localStorage on initial mount
  useEffect(() => {
    const savedImage = localStorage.getItem('iptvCustomImage');
    const finalSrc = savedImage 
      ? savedImage
      : (isMobile ? mobileFeatureImageUrl || featureImageUrl : featureImageUrl) || defaultIptvImage?.imageUrl;

    setCurrentSrc(finalSrc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, featureImageUrl, mobileFeatureImageUrl]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedDataUrl = await resizeImage(file, 1280, 800);
        setPreviewSrc(resizedDataUrl);
      } catch (error) {
        console.error("Error resizing image:", error);
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

  const triggerFileSelect = () => fileInputRef.current?.click();

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
                       <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
                         <a href="#contact">Get IPTV</a>
                       </Button>
                    </div>
                </div>
              </Fade>
              <Fade direction="right" triggerOnce>
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted relative group">
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
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                      <input
                        type="file"
                        id="imageUploadInput"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Button id="imageUploadButton" onClick={triggerFileSelect} variant="outline">
                        IPTV Image Uploader
                      </Button>
                      {previewSrc && (
                        <Button
                          id="saveImageButton"
                          onClick={handleSaveImage}
                          className="premium-red-bg text-white"
                        >
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
