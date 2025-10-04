"use client";

import React, { useRef, useState }from 'react';
import { useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

export function UniversalLogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

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
      if (event.target) event.target.value = '';
    }
  };

  const handlePasteUrl = async () => {
    if (!pastedUrl) {
        toast({ variant: "destructive", title: "No URL", description: "Please paste a URL to an image." });
        return;
    }
    try {
        new URL(pastedUrl);
    } catch (_) {
        toast({ variant: "destructive", title: "Invalid URL", description: "The URL you pasted is not valid." });
        return;
    }

    setIsProcessing(true);
    await saveLogoUrl(pastedUrl);
    setIsProcessing(false);
    setPastedUrl('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Update Your Logo</CardTitle>
        <CardDescription>Upload a new logo or paste an image URL. This will update the logo across your entire site for both desktop and mobile.</CardDescription>
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
            <h3 className="text-sm font-medium">Paste image URL</h3>
            <div className="flex gap-2">
                <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={pastedUrl}
                    onChange={(e) => setPastedUrl(e.target.value)}
                    disabled={isProcessing}
                />
                <Button onClick={handlePasteUrl} disabled={isProcessing} aria-label="Submit URL">
                    <LinkIcon />
                </Button>
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
