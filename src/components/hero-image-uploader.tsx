
"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


export function HeroImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const firestore = useFirestore();
  const storage = useStorage();


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const saveHeroImage = async (imageDataUrl: string) => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not available.",
      });
      return;
    }
    try {
      const settingsDocRef = doc(firestore, 'site-settings', 'config');
      await setDoc(settingsDocRef, { heroImageUrl: imageDataUrl }, { merge: true });
      
      toast({
        title: "Hero image updated!",
        description: "Your new hero image has been applied.",
      });
    } catch (error) {
       console.error("Error saving image URL to Firestore:", error);
       toast({
        variant: "destructive",
        title: "Could not save image",
        description: "There was an error saving the image URL.",
      });
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && storage) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for hero images
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file (e.g., PNG, JPG, WEBP).",
        });
        return;
      }
      
      setIsUploading(true);
      try {
        const imageRef = storageRef(storage, `images/heroImage-${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        await saveHeroImage(downloadURL);
      } catch (error) {
         console.error("Error uploading file:", error);
         toast({
            variant: "destructive",
            title: "Error uploading file",
            description: "Could not upload the selected file. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    }
    // Reset file input to allow uploading the same file again
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
        <h3 className="font-medium">Hero Image</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={handleButtonClick} disabled={isUploading || !firestore || !storage}>
            <Upload className="mr-2" />
            {isUploading ? "Uploading..." : "Upload Hero Image"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended aspect ratio: 16:9. Max file size: 5MB.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
    </div>
  );
}
