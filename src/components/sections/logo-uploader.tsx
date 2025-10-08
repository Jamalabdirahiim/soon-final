
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, ClipboardPaste } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Function to convert file to Base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export default function LogoUploader() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [file, setFile] = useState<FileWithPath | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (firestore) {
      setIsReady(true);
    }
  }, [firestore]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];
      // Add path property if it's missing (e.g., from paste event)
      if (!('path' in acceptedFile)) {
        Object.defineProperty(acceptedFile, 'path', {
          value: acceptedFile.name,
          writable: true,
        });
      }
      setFile(acceptedFile);
    }
  }, []);

  // Handle paste event
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              onDrop([file as FileWithPath]);
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onDrop]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.svg', '.gif', '.webp'] },
    multiple: false,
    disabled: isProcessing || !isReady,
  });
  
  const handleUpload = useCallback(async () => {
    if (!file || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Uploader not ready. Please try again in a moment.",
      });
      return;
    }

    setIsProcessing(true);

    try {
        const dataUrl = await toBase64(file);
        
        const logoDocRef = doc(firestore, 'site-settings', 'logo');
        
        // This is an intentional non-awaited call to allow for optimistic UI
        setDoc(logoDocRef, { url: dataUrl }, { merge: true }).catch(error => {
          console.error("Firestore save error:", error);
          const permissionError = new FirestorePermissionError({
            path: logoDocRef.path,
            operation: 'update',
            requestResourceData: { url: 'REDACTED_DATA_URL' }
          });
          errorEmitter.emit('permission-error', permissionError);
        });

        toast({
            title: "Upload Successful!",
            description: "Your new logo has been applied across the site.",
        });

        // Dispatch a custom event to notify other components (like the header)
        window.dispatchEvent(new CustomEvent('logoChanged'));
        setFile(null); // Clear the file after successful upload

    } catch (error: any) {
        console.error("Upload or save error:", error);
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: "Could not process the logo. Please check the console for details.",
        });
    } finally {
        setIsProcessing(false);
    }
  }, [file, firestore, toast]);

  return (
    <section id="logo-uploader" className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Customize</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
              Upload Your Logo
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Update your brand identity in real-time. Drag, drop, or paste your new logo below.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
           <div 
                {...getRootProps()} 
                className={cn(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    isDragActive ? "border-primary bg-primary/10" : "border-border bg-background",
                    !isReady && "cursor-not-allowed opacity-50"
                )}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="relative w-full h-full p-4">
                        <Image src={preview} alt="Logo preview" layout="fill" objectFit="contain" />
                        {!isProcessing && (
                          <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setFile(null);}}>
                              <X className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <UploadCloud className="mx-auto h-12 w-12" />
                        <p className="mt-2 font-semibold">
                            {isDragActive ? 'Drop your logo here' : "Drag 'n' drop or click to upload"}
                        </p>
                        <div className="flex items-center justify-center mt-2 text-xs gap-2">
                          <ClipboardPaste className="h-4 w-4" />
                          <span>You can also paste from clipboard</span>
                        </div>
                         {!isReady && <p className="text-xs mt-2 text-destructive">Initializing uploader...</p>}
                    </div>
                )}
            </div>

            {isProcessing && (
                <div className="w-full text-center space-y-2 mt-4">
                    <Progress value={undefined} />
                    <p className="text-sm text-muted-foreground">Processing and saving...</p>
                </div>
            )}

            {file && !isProcessing && (
                <div className="mt-6 flex justify-center">
                    <Button onClick={handleUpload} size="lg" disabled={isProcessing || !isReady}>
                        {isProcessing ? "Saving..." : "Apply Logo"}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}


