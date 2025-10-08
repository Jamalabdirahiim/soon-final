
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function LogoUploader() {
  const storage = useStorage();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [file, setFile] = useState<FileWithPath | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.svg', '.gif', '.webp'] },
    multiple: false,
    disabled: isUploading,
  });
  
  const handleUpload = useCallback(async () => {
    if (!file || !storage || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Prerequisites not met. Please try again later.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `logos/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Something went wrong during the upload. Please try again.",
        });
        setIsUploading(false);
        setUploadProgress(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const logoDocRef = doc(firestore, 'site-settings', 'logo');
          
          setDoc(logoDocRef, { url: downloadURL }, { merge: true }).catch(serverError => {
             const permissionError = new FirestorePermissionError({
                path: logoDocRef.path,
                operation: 'update',
                requestResourceData: { url: downloadURL },
            });
            errorEmitter.emit('permission-error', permissionError);
          });

          toast({
            title: "Upload Successful!",
            description: "Your new logo has been applied across the site.",
          });
          
          window.dispatchEvent(new CustomEvent('logoChanged'));
          setFile(null);

        } catch (dbError) {
          console.error("Firestore error:", dbError);
          toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not save the new logo URL. Please contact support.",
          });
        } finally {
            setIsUploading(false);
            setUploadProgress(null);
        }
      }
    );
  }, [file, storage, firestore, toast]);

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
              Update your brand identity in real-time. Drag and drop your new logo below.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
           <div 
                {...getRootProps()} 
                className={cn(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    isDragActive ? "border-primary bg-primary/10" : "border-border bg-background"
                )}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="relative w-full h-full p-4">
                        <Image src={preview} alt="Logo preview" layout="fill" objectFit="contain" />
                        {!isUploading && (
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
                        <p className="text-xs mt-1">SVG, PNG, JPG, GIF or WEBP</p>
                    </div>
                )}
            </div>

            {uploadProgress !== null && isUploading && (
                <div className="w-full text-center space-y-2 mt-4">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
                </div>
            )}

            {file && !isUploading && (
                <div className="mt-6 flex justify-center">
                    <Button onClick={handleUpload} size="lg" disabled={isUploading}>
                        Apply Logo
                    </Button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
