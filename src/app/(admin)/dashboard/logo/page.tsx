
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SoonLogo } from '@/components/soon-logo';
import { Separator } from '@/components/ui/separator';

export default function UniversalLogoUploaderPage() {
  const storage = useStorage();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [file, setFile] = useState<FileWithPath | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Effect to create a preview URL when a file is selected
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Cleanup by revoking the object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleUpload = useCallback(async (fileToUpload: File) => {
    if (!storage || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firebase is not ready. Please try again later.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `logos/${Date.now()}_${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

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
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const logoDocRef = doc(firestore, 'site-settings', 'logo');
          await setDoc(logoDocRef, { url: downloadURL }, { merge: true });

          toast({
            title: "Upload Successful!",
            description: "Your new logo has been applied across the site.",
          });
          
          // Trigger a custom event to tell the logo component to re-fetch
          window.dispatchEvent(new CustomEvent('logoChanged'));

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
            setFile(null);
            setPreview(null);
        }
      }
    );
  }, [storage, firestore, toast]);
  
  // Effect to trigger the upload when the file state changes
  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file, handleUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isUploading) return;
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [isUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.svg', '.gif'] },
    multiple: false,
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  }

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
          <CardDescription>Upload a new logo to apply it across your entire website instantly.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
                <div 
                    {...getRootProps()} 
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                        "hover:bg-accent/50",
                        isDragActive ? "border-primary bg-primary/10" : "border-border bg-background"
                    )}
                >
                    <input {...getInputProps()} disabled={isUploading} />
                    {isUploading && uploadProgress !== null ? (
                        <div className="w-full max-w-xs px-4 text-center space-y-4">
                            <p className="font-medium text-primary">Uploading...</p>
                            <Progress value={uploadProgress} />
                            <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</p>
                        </div>
                    ) : preview ? (
                        <div className="relative w-full h-full p-4">
                            <Image src={preview} alt="Logo preview" layout="fill" objectFit="contain" />
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); clearFile();}}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <UploadCloud className="mx-auto h-12 w-12" />
                            <p className="mt-2 font-semibold">
                                {isDragActive ? 'Drop your logo here' : "Drag 'n' drop or click to upload"}
                            </p>
                            <p className="text-xs mt-1">SVG, PNG, JPG or GIF</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Current Logo Preview</h3>
                <p className="text-sm text-muted-foreground">This is how your logo currently appears in the website header.</p>
                <Separator />
                <div className="p-6 rounded-lg bg-secondary flex items-center justify-center">
                    <SoonLogo hasScrolled={true} />
                </div>
                 <div className="p-6 rounded-lg bg-primary flex items-center justify-center">
                    <SoonLogo hasScrolled={false} />
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
