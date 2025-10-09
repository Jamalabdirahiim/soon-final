
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUser, useStorage } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { placeholderImages } from '@/lib/placeholder-images.json';

const IptvHero = () => {
  const { user } = useUser();
  const storage = useStorage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imagePath = 'hero/iptv-hero.jpg';

  // Function to fetch the image URL from Firebase Storage
  const fetchImageUrl = async (storageInstance: any) => {
    try {
      const imageRef = ref(storageInstance, imagePath);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (e: any) {
      if (e.code === 'storage/object-not-found') {
        const defaultImage = placeholderImages.find(p => p.id === 'iptv-hero');
        setImageUrl(defaultImage?.imageUrl || null);
      } else {
        console.error('Error fetching image URL:', e);
        setError('Failed to load image.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch image on component mount
  useEffect(() => {
    if (storage) {
      fetchImageUrl(storage);
    }
  }, [storage]);

  // Handler for file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage || !user) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    const imageRef = ref(storage, imagePath);

    try {
      // Upload the new image, overwriting the old one
      await uploadBytes(imageRef, file);
      // Get the new download URL and update the state
      const newUrl = await getDownloadURL(imageRef);
      setImageUrl(newUrl);
      setSuccessMessage('✅ IPTV image updated successfully');
    } catch (e) {
      console.error('Error uploading image:', e);
      setError('Failed to upload image.');
    } finally {
      setIsUploading(false);
       // Clear the file input
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handler for the "Change Image" button click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="flex flex-col items-center" id="iptv">
      <div className="w-full h-[80vh] relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="IPTV Service Showcase"
            fill
            className="object-cover w-full h-full"
            priority
            key={imageUrl} // Force re-render on URL change
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Image not found.</p>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
      </div>

      {user && (
        <div className="mt-4 text-center">
          <Button
            onClick={handleButtonClick}
            disabled={isUploading}
            className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105"
          >
            {isUploading ? 'Uploading...' : 'Change IPTV Image'}
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
          {error && !isUploading && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </section>
  );
};

export default IptvHero;
