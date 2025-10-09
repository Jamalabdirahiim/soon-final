
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { content } from "@/lib/content";
import { useUser } from "@/firebase";
import { ADMIN_EMAILS } from "@/lib/admin";
import { ImageUploaderDialog } from "../image-uploader-dialog";
import { IptvImageUploader } from "./iptv-image-uploader";
import { Fade } from "react-awesome-reveal";
import React, { useState, useEffect, useRef } from "react";

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const MAX_IMAGE_WIDTH = 1920; // Max width for the saved image
const IMAGE_QUALITY = 0.8; // JPEG quality

// Helper function to resize image using canvas
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = MAX_IMAGE_WIDTH / img.width;
        canvas.width = MAX_IMAGE_WIDTH;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};


export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  const { user } = useUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");
  
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const imageUploadInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This effect runs only once on the client-side after initial mount.
    const savedImage = localStorage.getItem('iptvCustomImage');
    if (savedImage) {
      setCurrentSrc(savedImage);
    } else {
      // Fallback to server-provided or default images if nothing is in localStorage
      const desktopSrc = featureImageUrl || defaultIptvImage?.imageUrl;
      const mobileSrc = mobileFeatureImageUrl || desktopSrc;
      setCurrentSrc(isMobile ? mobileSrc : desktopSrc);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]); 


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedDataUrl = await resizeImage(file);
        setPreviewSrc(resizedDataUrl);
      } catch (error) {
        console.error("Error resizing image:", error);
        // Optionally, show a toast to the user
      }
    }
  };

  const handleSaveImage = () => {
    if (previewSrc) {
      try {
        localStorage.setItem('iptvCustomImage', previewSrc);
        setCurrentSrc(previewSrc);
        setPreviewSrc(null); // Clear preview after saving
      } catch (error) {
          console.error("Error saving image to localStorage:", error);
          // Handle potential quota errors, e.g., by notifying the user.
      }
    }
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
                    {isAdmin ? (
                       <ImageUploaderDialog
                          triggerText="Edit IPTV Image"
                          dialogTitle="Update IPTV Section Image"
                       >
                          <IptvImageUploader />
                       </ImageUploaderDialog>
                    ) : (
                      <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg mt-4">
                          <Link href="#contact">Learn More</Link>
                      </Button>
                    )}
                </div>
              </Fade>
              <Fade direction="right" triggerOnce>
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden">
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
                        ref={imageUploadInput}
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                          id="imageUploadButton"
                          onClick={() => imageUploadInput.current?.click()}
                          className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300"
                      >
                          IPTV Image Uploader
                      </button>
                      {previewSrc && (
                        <button
                          onClick={handleSaveImage}
                          className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-300"
                        >
                          Save Image
                        </button>
                      )}
                    </div>
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
