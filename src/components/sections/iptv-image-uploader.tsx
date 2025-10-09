
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { revalidateHome } from '@/app/actions';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export function IptvImageUploader() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [file, setFile] = useState<FileWithPath | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (firestore) setIsReady(true);
  }, [firestore]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];
       if (!('path' in acceptedFile)) {
        Object.defineProperty(acceptedFile, 'path', { value: acceptedFile.name, writable: true });
      }
      setFile(acceptedFile);
    }
  }, []);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) onDrop([file as FileWithPath]);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
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
    if (!file || !firestore) return;
    setIsProcessing(true);

    try {
        const dataUrl = await toBase64(file);
        const configDocRef = doc(firestore, 'site-settings', 'config');
        
        const imageData = {
          featureImageUrl: dataUrl,
          mobileFeatureImageUrl: dataUrl, // Set both as IPTV image works for both
        };

        setDoc(configDocRef, imageData, { merge: true })
          .then(async () => {
            await revalidateHome();
            toast({
                title: "Upload Successful!",
                description: "The IPTV section image has been updated.",
            });
            setFile(null);
          })
          .catch(error => {
            const permissionError = new FirestorePermissionError({
              path: configDocRef.path,
              operation: 'update',
              requestResourceData: { featureImageUrl: 'REDACTED_DATA_URL' }
            });
            errorEmitter.emit('permission-error', permissionError);
          });

    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not process image." });
    } finally {
        setIsProcessing(false);
    }
  }, [file, firestore, toast]);

  return (
    <div className="w-full">
        <div 
            {...getRootProps()} 
            className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                "hover:bg-accent/50",
                isDragActive ? "border-primary bg-primary/10" : "border-border bg-background",
                !isReady && "cursor-not-allowed opacity-50"
            )}
        >
            <input {...getInputProps()} />
            {preview ? (
                <div className="relative w-full h-full p-4">
                    <Image src={preview} alt="Preview" layout="fill" objectFit="contain" />
                    {!isProcessing && (
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setFile(null);}}>
                          <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground p-4">
                    <UploadCloud className="mx-auto h-12 w-12" />
                    <p className="mt-2 font-semibold">{isDragActive ? 'Drop image here' : "Drag 'n' drop, click, or paste"}</p>
                    <p className="text-xs mt-1">Image for the IPTV promotion section</p>
                </div>
            )}
        </div>
        {file && !isProcessing && (
            <div className="mt-4 flex justify-end">
                <Button onClick={handleUpload} disabled={isProcessing || !isReady}>
                    {isProcessing ? "Saving..." : "Apply Image"}
                </Button>
            </div>
        )}
    </div>
  );
}
