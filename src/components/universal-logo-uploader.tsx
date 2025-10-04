
"use client";

import React, { useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, ClipboardPaste } from 'lucide-react';
import { useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

export default function UniversalLogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const firestore = useFirestore();
  const storage = useStorage();

  const isWorking = isProcessing || isUploading;

  const saveLogoUrl = async (logoUrl: string) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
      return;
    }
    try {
      const settingsDocRef = doc(firestore, 'site-settings', 'config');
      await setDoc(settingsDocRef, { logoUrl: logoUrl, mobileLogoUrl: logoUrl }, { merge: true });
      toast({
        title: "Logo Updated!",
        description: "Your new logo has been applied across the site.",
      });
      // Dispatch an event to notify header to update logo
      window.dispatchEvent(new CustomEvent('logoUpdated'));
    } catch (error) {
      console.error("Error saving logo URL to Firestore:", error);
      toast({ variant: "destructive", title: "Could not save logo", description: "There was an error saving the logo URL." });
    }
  };

  const processAndUploadFile = useCallback(async (file: File) => {
    if (!storage) {
        toast({ variant: "destructive", title: "Storage not configured", description: "Firebase Storage is not available." });
        return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ variant: "destructive", title: "Invalid File Type", description: "Please upload or paste an image file." });
      return;
    }

    setIsProcessing(true);

    // 1. Create a canvas to resize and convert the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.src = URL.createObjectURL(file);
    await new Promise(resolve => image.onload = resolve);
    
    const maxWidth = 400;
    const scale = maxWidth / image.width;
    canvas.width = maxWidth;
    canvas.height = image.height * scale;
    
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // 2. Get the optimized image blob from canvas
    const optimizedBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
    
    if (!optimizedBlob) {
        setIsProcessing(false);
        toast({ variant: "destructive", title: "Processing Failed", description: "Could not optimize the image." });
        return;
    }

    const optimizedFile = new File([optimizedBlob], `logo_${Date.now()}.webp`, { type: 'image/webp' });

    setIsProcessing(false);
    setIsUploading(true);

    // 3. Upload the optimized blob
    try {
      const logoRef = storageRef(storage, `logos/universal-logo-${Date.now()}`);
      const snapshot = await uploadBytes(logoRef, optimizedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await saveLogoUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload the logo. Please try again." });
    } finally {
      setIsUploading(false);
    }
  }, [storage, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
    event.target.value = ''; // Reset input
  };

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processAndUploadFile(file);
          // Prevent the default paste action
          event.preventDefault(); 
          return;
        }
      }
    }
  }, [processAndUploadFile]);

  return (
    <section id="logo-uploader" className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-2xl mx-auto shadow-md">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-headline">Universal Logo Uploader</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                            onClick={() => fileInputRef.current?.click()} 
                            disabled={isWorking}
                            className="flex-1"
                        >
                            {isWorking ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="mr-2" />
                            )}
                            Upload from device
                        </Button>

                        <div 
                            onPaste={handlePaste}
                            className={cn(
                                "flex-1 p-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors",
                                isWorking && "cursor-not-allowed opacity-50"
                            )}
                            tabIndex={isWorking ? -1 : 0}
                            role="button"
                            aria-label="Paste image area"
                        >
                            <ClipboardPaste className="h-6 w-6 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Paste image directly</p>
                            <p className="text-xs text-muted-foreground">(Ctrl+V or Cmd+V)</p>
                        </div>
                    </div>
                     <div className="h-6 text-center">
                        {isProcessing && <p className="text-sm text-muted-foreground animate-pulse">Processing image...</p>}
                        {isUploading && <p className="text-sm text-muted-foreground animate-pulse">Uploading logo...</p>}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp, image/gif, image/bmp"
                        disabled={isWorking}
                    />
                </CardContent>
            </Card>
        </div>
    </section>
  );
}
