'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useStorage } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { revalidateHome } from '@/app/actions';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

export function IptvImageUploader() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !firestore) return;

    setUploading(true);
    
    try {
      const dataUrl = await toBase64(file);
      const configDocRef = doc(firestore, 'site-settings', 'config');

      // Since IPTV hero often looks good on both, we set both fields.
      const imageData = {
        featureImageUrl: dataUrl,
        mobileFeatureImageUrl: dataUrl,
      };

      await setDoc(configDocRef, imageData, { merge: true });
      await revalidateHome();
      
      toast({
        title: "Upload Successful",
        description: "Your IPTV image has been updated.",
      });
      
      setFile(null);
    } catch (err: any) {
        console.error("Upload failed:", err);
        const permissionError = new FirestorePermissionError({
            path: 'site-settings/config',
            operation: 'update',
            requestResourceData: { featureImageUrl: 'REDACTED', mobileFeatureImageUrl: 'REDACTED' },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Could not save image. Check console for details.",
        });
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="iptv-image-upload">Upload an image</Label>
        <Input id="iptv-image-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium">Preview:</p>
          <div className="relative w-full aspect-video mt-2 rounded-md overflow-hidden border">
            <Image src={preview} alt="IPTV Hero Preview" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}

      {file && (
        <div className="flex justify-end">
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Apply Image'}
          </Button>
        </div>
      )}
    </div>
  );
}
