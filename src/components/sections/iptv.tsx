
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

export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  const { user } = useUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");
  const [currentSrc, setCurrentSrc] = useState(featureImageUrl || defaultIptvImage?.imageUrl);
  const imageUploadInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    // It's the correct place to interact with localStorage.
    
    // 1. Prioritize the user's permanently saved image from localStorage.
    const savedImage = localStorage.getItem('iptvCustomImage');
    if (savedImage) {
      setCurrentSrc(savedImage);
    } else {
      // 2. If no saved image, use server-provided images with mobile responsiveness.
      const desktopSrc = featureImageUrl || defaultIptvImage?.imageUrl;
      const mobileSrc = mobileFeatureImageUrl || desktopSrc;
      // We check 'isMobile' here because this effect runs client-side.
      if (typeof isMobile !== 'undefined') {
        setCurrentSrc(isMobile ? mobileSrc : desktopSrc);
      }
    }
  }, [isMobile, featureImageUrl, mobileFeatureImageUrl, defaultIptvImage]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Update the image source on the screen immediately.
        setCurrentSrc(dataUrl);
        // Save the Data URL to localStorage to make it permanent.
        localStorage.setItem('iptvCustomImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

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
                    </div>
                    <input
                        type="file"
                        id="imageUploadInput"
                        ref={imageUploadInput}
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                    />
                    <button
                        id="imageUploadButton"
                        onClick={() => imageUploadInput.current?.click()}
                        className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300"
                    >
                        IPTV Image Uploader
                    </button>
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
