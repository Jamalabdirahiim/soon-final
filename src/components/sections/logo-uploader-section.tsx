
'use client';

import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';

export default function LogoUploaderSection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const storage = useStorage();
  const db = useFirestore();
  const { toast } = useToast();

  const handleUpload = useCallback(async (fileToUpload: File) => {
    if (!storage || !db) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firebase is not ready. Please try again later.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const storageRef = ref(storage, `logos/${Date.now()}-${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        setError('Upload failed. Please try again.');
        toast({
            variant: "destructive",
            title: "Upload failed",
            description: "There was an error during the upload.",
        });
        setUploading(false);
        setFile(null);
      },
      async () => {
        try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const settingsRef = doc(db, 'site-settings', 'logo');
            await setDoc(settingsRef, { url: downloadURL });
            
            toast({
                title: "Success!",
                description: "Logo uploaded and updated successfully!",
            });
        } catch (error) {
            console.error('Error saving logo URL to Firestore:', error);
            setError('Failed to save the new logo. Please try again.');
            toast({
                variant: "destructive",
                title: "Database Error",
                description: "Failed to save the new logo URL.",
            });
        } finally {
            setUploading(false);
            setFile(null);
        }
      }
    );
  }, [db, storage, toast]);

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file, handleUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
       if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
        });
        return;
      }
      setFile(selectedFile);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.gif'] },
    multiple: false,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(Array.from(e.target.files));
    }
  };


  return (
    <section id="logo-uploader" className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Customize</div>
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                        Update Your Brand Logo
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Upload a new logo to apply it across your entire website instantly.
                    </p>
                </div>
            </div>

            <div className="mx-auto mt-12 max-w-xl">
                 <div
                    {...getRootProps()}
                    className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
                    }`}
                >
                    <input {...getInputProps()} id="logo-file-input" />
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UploadCloud className="h-12 w-12" />
                        <p className="font-semibold">
                            {isDragActive ? "Drop the file here..." : "Drag 'n' drop your logo here, or click to select a file"}
                        </p>
                        <p className="text-xs">SVG, PNG, JPG or GIF (max. 2MB)</p>
                    </div>
                </div>

                {file && !uploading && !error && (
                    <div className="mt-4 text-center">
                        <p className="text-sm font-medium text-gray-700">Selected file: {file.name}</p>
                    </div>
                )}

                {uploading && (
                    <div className="mt-6 w-full">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
                    </div>
                )}
                
                {error && (
                    <div className="mt-4 text-center text-red-600">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    </section>
  );
};
