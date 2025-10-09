'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStorage, useUser } from '@/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Camera } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IptvImageUploader } from './iptv-image-uploader';

interface IptvHeroProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const IptvHero = ({ featureImageUrl, mobileFeatureImageUrl }: IptvHeroProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Prioritize server-provided URL, then fetch from storage
    const initialUrl = featureImageUrl || mobileFeatureImageUrl;
    if (initialUrl) {
      setImageUrl(initialUrl);
      setLoading(false);
    } else {
      // Fallback to a default if you have one, or just show empty/loading state
      setLoading(false);
    }
  }, [featureImageUrl, mobileFeatureImageUrl]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="w-full h-full" />;
    }

    if (imageUrl) {
      return (
        <Image
          src={imageUrl}
          alt="IPTV Service Showcase"
          fill
          className="object-contain w-full h-full"
          priority
          key={imageUrl}
        />
      );
    }

    // If no image URL is available
    if (user) {
      // Admin is logged in, show an upload dialog trigger
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-center text-muted-foreground p-8 flex flex-col items-center h-auto">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">IPTV Image Not Set</h3>
              <p className="mt-1 text-sm text-gray-500">Click to upload an image for the IPTV section.</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload IPTV Image</DialogTitle>
            </DialogHeader>
            <IptvImageUploader />
          </DialogContent>
        </Dialog>
      );
    } else {
      // Non-admin view
      return (
        <div className="text-center text-muted-foreground p-8">
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">IPTV Image Not Set</h3>
          <p className="mt-1 text-sm text-gray-500">An admin can upload an image in the customization panel.</p>
        </div>
      );
    }
  };

  return (
    <section className="flex flex-col items-center" id="iptv">
        <div className="w-full h-[80vh] relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
            {renderContent()}
        </div>
    </section>
  );
};

export default IptvHero;
