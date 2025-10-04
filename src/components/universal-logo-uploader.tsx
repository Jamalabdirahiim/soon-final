
"use client";

import React, { useRef, useState, useCallback } from 'react';
import { useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Upload, Clipboard, Loader2 } from 'lucide-react';

export function UniversalLogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const firestore = useFirestore();
  const storage = useStorage();

  const saveLogoUrl = async (logoUrl: string) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
      return;
    }
    try {
      const settingsDocRef = doc(firestore, 'site-settings', 'config');
      await setDoc(settingsDocRef, { logoUrl: logoUrl, mobileLogoUrl: logoUrl }, { merge: true });
      toast({
        title: "Logo updated successfully!",
        description: "Your new logo has been applied across the site.",
      });
    } catch (error) {
      console.error("Error saving logo URL to Firestore:", error);
      toast({
        variant: "destructive",
        title: "Could not save logo",
        description: "There was an error saving the logo URL to the database.",
      });
    }
  };
  
  const processAndUploadFile = useCallback(async (file: File) => {
    if (!storage) {
        toast({ variant: "destructive", title: "Error", description: "Storage is not available." });
        return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({ variant: "destructive", title: "File too large", description: "Please select an image smaller than 2MB." });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ variant: "destructive", title: "Invalid file type", description: "Please select an image file." });
      return;
    }

    setIsProcessing(true);
    try {
      const uniqueLogoRef = storageRef(storage, `logos/universal-logo-${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(uniqueLogoRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await saveLogoUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({ variant: "destructive", title: "Upload failed", description: "Could not upload the selected file. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  }, [storage, toast, saveLogoUrl]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processAndUploadFile(file);
    }
    if (event.target) event.target.value = '';
  };

  const handlePaste = useCallback(async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
                await processAndUploadFile(file);
                // Prevent the browser from also pasting the image into the contenteditable div
                event.preventDefault(); 
                return;
            }
        }
    }
     toast({
        variant: 'destructive',
        title: 'Paste Error',
        description: 'No image found on the clipboard. Please copy an image first.',
      });
  }, [processAndUploadFile, toast]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Update Your Logo</CardTitle>
        <CardDescription>Upload a new logo or paste an image directly. This will update the logo across your entire site for both desktop and mobile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Upload from your device</h3>
            <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isProcessing}
                className="w-full"
                variant="outline"
            >
                <Upload className="mr-2" />
                {isProcessing ? "Processing..." : "Choose an Image to Upload"}
            </Button>
            <p className="text-xs text-muted-foreground pt-1">
                Recommended size: 200x56px. Max 2MB.
            </p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
            />
        </div>
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="text-sm font-medium">Paste image directly</h3>
            <div 
                onPaste={handlePaste}
                className="flex items-center justify-center flex-col w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                tabIndex={0} // Make it focusable
            >
                <Clipboard className="h-8 w-8 mb-2"/>
                <p>Click here and paste your image</p>
                <p className="text-xs">(Ctrl+V or Cmd+V)</p>
            </div>
        </div>

        {isProcessing && (
             <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Updating logo... please wait.</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
