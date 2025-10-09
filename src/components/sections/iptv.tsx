
"use client";

import React, { useState, useRef } from 'react';
import Image from "next/image";
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { Fade } from "react-awesome-reveal";
import { useToast } from "@/hooks/use-toast";
import { revalidateHome } from '@/app/actions';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { Tv } from 'lucide-react';
import firestoreRules from '!!raw-loader!../../../firestore.rules';

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

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
        return reject(new Error('Failed to get canvas context.'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/webp', 0.8));
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const isMobile = useIsMobile();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const getSrc = () => {
    const desktopSrc = featureImageUrl || "https://images.unsplash.com/photo-1593359677879-a4bb92f82d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxsaXZpbmclMjByb29tJTIwdGVsZXZpc2lvbnxlbnwwfHx8fDE3MjE4MzQ5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080";
    const mobileSrc = mobileFeatureImageUrl || desktopSrc;
    
    if (isMobile === undefined) {
      return featureImageUrl || desktopSrc;
    }
    
    return isMobile ? mobileSrc : desktopSrc;
  };

  const currentSrc = getSrc();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firestore) return;

    setIsProcessing(true);
    toast({ title: "Uploading...", description: "Your image is being processed." });

    try {
        const dataUrl = await resizeImage(file, 1280, 720);
        const configDocRef = doc(firestore, 'site-settings', 'config');
        
        const imageData = {
          featureImageUrl: dataUrl,
          mobileFeatureImageUrl: dataUrl,
        };

        await setDoc(configDocRef, imageData, { merge: true });
        
        await revalidateHome();
        toast({
            title: "Upload Successful!",
            description: "The IPTV section image has been updated.",
        });

    } catch (error) {
        // Since firestore.rules now allow public writes, this error is less likely,
        // but we keep it for robustness.
        const permissionError = new FirestorePermissionError({
          path: 'site-settings/config',
          operation: 'update',
          requestResourceData: { featureImageUrl: 'REDACTED_DATA_URL' }
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setIsProcessing(false);
        // Reset file input
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const { headline, subheadline } = content.iptv;

  return (
    <section id="iptv" className="bg-secondary py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Fade direction="left" triggerOnce>
                <div className="space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        <Tv className="h-4 w-4" />
                        <span>SOON IPTV</span>
                    </div>
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl premium-blue-text">
                        {headline}
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        {subheadline}
                    </p>
                    <p className="text-xl font-bold text-primary">400+ Live TV Channels</p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
                       <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
                         <a href="#contact">Get It Now</a>
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
                              alt={"IPTV service interface"}
                              fill
                              className="w-full h-full object-cover"
                              data-ai-hint={"living room television"}
                              key={currentSrc}
                              priority
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
                        disabled={isProcessing}
                      />
                      <Button id="imageUploadButton" onClick={triggerFileSelect} variant="outline" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "IPTV Image Uploader"}
                      </Button>
                    </div>
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
