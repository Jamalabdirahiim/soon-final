
"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Library } from 'lucide-react';
import { useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { MediaLibrary } from '@/app/admin/dashboard/media/media-library';

export function FeatureImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const firestore = useFirestore();
  const storage = useStorage();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const saveFeatureImage = async (imageDataUrl: string) => {
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
      await setDoc(settingsDocRef, { featureImageUrl: imageDataUrl }, { merge: true });
      toast({
        title: "Feature image updated!",
        description: "Your new feature image has been applied.",
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
        const imageRef = storageRef(storage, `images/featureImage-${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        await saveFeatureImage(downloadURL);
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
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
        <h3 className="font-medium">Bluezone Image</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={handleButtonClick} disabled={isUploading || !firestore || !storage}>
            <Upload className="mr-2" />
            {isUploading ? "Uploading..." : "Upload Bluezone Image"}
          </Button>
          <Button onClick={() => setIsLibraryOpen(true)} disabled={isUploading || !firestore || !storage} variant="outline">
            <Library className="mr-2" />
            Select from Library
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Transparent laptop images work best. Max file size: 5MB.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Feature Image from Media Library</DialogTitle>
                </DialogHeader>
                <MediaLibrary onSelect={(url) => {
                    saveFeatureImage(url);
                    setIsLibraryOpen(false);
                }} />
            </DialogContent>
        </Dialog>
    </div>
  );
}
