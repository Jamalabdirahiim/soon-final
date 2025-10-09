
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { revalidateHome } from '@/app/actions';

interface IptvHeroProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const IptvHero = ({ featureImageUrl, mobileFeatureImageUrl }: IptvHeroProps) => {
    const isMobile = useIsMobile();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [file, setFile] = useState<FileWithPath | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            if (!('path' in acceptedFile)) {
                Object.defineProperty(acceptedFile, 'path', {
                    value: acceptedFile.name,
                    writable: true,
                });
            }
            setFile(acceptedFile);
            setIsDialogOpen(true);
        }
    }, []);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [file]);
    
    const handleCloseDialog = () => {
      if (isProcessing) return;
      setFile(null);
      setIsDialogOpen(false);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.svg', '.gif', '.webp'] },
        multiple: false,
        noClick: !user, // Disable click if not logged in
        noKeyboard: !user,
        noDrag: !user,
        disabled: !user || isProcessing,
    });

    const handleUpload = useCallback(async () => {
        if (!file || !firestore) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Uploader not ready.",
            });
            return;
        }

        setIsProcessing(true);

        try {
            const dataUrl = await toBase64(file);
            const configDocRef = doc(firestore, 'site-settings', 'config');

            // Set both desktop and mobile to the same image for simplicity
            await setDoc(configDocRef, { 
                featureImageUrl: dataUrl,
                mobileFeatureImageUrl: dataUrl,
            }, { merge: true });

            revalidateHome();
            toast({
                title: "Upload Successful!",
                description: "Your new IPTV image has been applied.",
            });
            handleCloseDialog();
        } catch (error: any) {
            const configDocRef = doc(firestore, 'site-settings', 'config');
            console.error("Upload or save error:", error);
            const permissionError = new FirestorePermissionError({
              path: configDocRef.path,
              operation: 'update',
              requestResourceData: { featureImageUrl: 'REDACTED_DATA_URL' }
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsProcessing(false);
        }
    }, [file, firestore, toast]);

    const getSrc = () => {
        if (isMobile === undefined) return null;
        const desktopSrc = featureImageUrl;
        const mobileSrc = mobileFeatureImageUrl || desktopSrc;
        return isMobile ? mobileSrc : desktopSrc;
    };

    const imageUrl = getSrc();

    if (isMobile === undefined) {
        return (
            <section className="flex flex-col items-center" id="iptv">
                <Skeleton className="w-full h-[80vh] rounded-xl" />
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center" id="iptv">
            <div className="w-full h-[80vh] relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="IPTV Service Showcase"
                        fill
                        className="object-contain w-full h-full"
                        key={imageUrl}
                    />
                ) : (
                    <div {...getRootProps({ className: cn("w-full h-full flex items-center justify-center", user ? "cursor-pointer" : "cursor-default", isDragActive && "bg-primary/10") })}>
                        <input {...getInputProps()} />
                        <div className="text-center text-muted-foreground p-8">
                            <ImageIcon className="mx-auto h-16 w-16" />
                            <h3 className="mt-4 text-lg font-semibold">IPTV Image Not Set</h3>
                            {user ? (
                               <p className="mt-2 text-sm">
                                 {isDragActive ? 'Drop image to upload' : "Click or drag 'n' drop an image here to set it."}
                               </p>
                            ) : (
                               <p className="mt-2 text-sm">An admin needs to be logged in to upload an image.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => {
                  if (isProcessing) e.preventDefault();
                }}>
                    <DialogHeader>
                        <DialogTitle>Confirm IPTV Image</DialogTitle>
                        <DialogDescription>
                           This image will be used for both desktop and mobile views. You can set different images in the main Customization Panel.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {preview && (
                             <div className="relative w-full h-64">
                                <Image src={preview} alt="IPTV image preview" layout="fill" objectFit="contain" className="rounded-md" />
                             </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCloseDialog} disabled={isProcessing}>Cancel</Button>
                        <Button onClick={handleUpload} disabled={isProcessing}>
                            {isProcessing ? "Saving..." : "Apply Image"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default IptvHero;
