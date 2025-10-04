
"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Library } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { MediaLibrary } from '@/app/admin/dashboard/media/media-library';

export function MobileFeatureImageUploader() {
  const { toast } = useToast();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const firestore = useFirestore();

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
      await setDoc(settingsDocRef, { mobileFeatureImageUrl: imageDataUrl }, { merge: true });
      toast({
        title: "Mobile Bluezone image updated!",
        description: "Your new image has been applied for mobile.",
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

  return (
    <div className="space-y-4">
        <h3 className="font-medium">Mobile Bluezone Image</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={() => setIsLibraryOpen(true)} disabled={!firestore} variant="outline">
            <Library className="mr-2" />
            Select from Library
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended for portrait images.
        </p>
        <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Mobile Feature Image</DialogTitle>
                    <DialogDescription>Choose an image from your library or upload a new one.</DialogDescription>
                </DialogHeader>
                 <div className="flex-grow overflow-y-auto">
                    <MediaLibrary onSelect={(url) => {
                        saveFeatureImage(url);
                        setIsLibraryOpen(false);
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
