
'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LogoUploaderSection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const storage = useStorage();
  const db = useFirestore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const fileToUpload = acceptedFiles[0];
    setFile(fileToUpload);

    const handleUpload = async (fileToUpload: File) => {
        if (!fileToUpload || !storage || !db) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Firebase is not ready. Please try again later.",
          });
          return;
        }
    
        setUploading(true);
        setUploadProgress(0);
    
        const storageRef = ref(storage, `logos/${fileToUpload.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
    
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload failed:', error);
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: "Please try again.",
            });
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            if (db) {
                try {
                  const settingsRef = doc(db, 'site-settings', 'logo');
                  await setDoc(settingsRef, { url: downloadURL });
                  toast({
                    title: "Success!",
                    description: "Logo uploaded successfully!",
                  });
                } catch (error) {
                  console.error('Error saving logo URL to Firestore:', error);
                  toast({
                    variant: "destructive",
                    title: "Database Error",
                    description: "Failed to save logo URL.",
                  });
                }
            }
            
            setUploading(false);
            setFile(null);
          }
        );
      };

    handleUpload(fileToUpload);
  }, [db, storage, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      onDrop([selectedFile]);
    }
  };

  return (
    <section id="logo-uploader" className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Update Your Brand Logo</CardTitle>
            <CardDescription>Upload a new logo to apply it across your entire website instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p className="text-primary">Drop the file here ...</p> :
                  <p className="text-muted-foreground">Drag 'n' drop your logo here, or click to select a file</p>
              }
            </div>
            <div className="mt-6 text-center">
              <Button onClick={() => document.getElementById('logo-file-input')?.click()} variant="outline">
                Select from Device
              </Button>
              <input
                id="logo-file-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            {file && !uploading && (
              <div className="mt-6">
                <p className="text-sm font-medium text-muted-foreground">Selected file: {file.name}</p>
              </div>
            )}
            {uploading && (
              <div className="mt-6">
                <Progress value={uploadProgress} />
                <p className="text-sm text-center mt-2 text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
