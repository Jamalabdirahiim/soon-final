
"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useStorage } from '@/firebase/storage/use-storage';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function MediaLibrary({ onSelect }: { onSelect: (url: string) => void; }) {
  const { files, loading, uploadFile, deleteFile } = useStorage('images');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }
      setIsUploading(true);
      try {
        await uploadFile(file);
        toast({
          title: "Upload successful!",
          description: `${file.name} has been added to the library.`,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Could not upload the selected file.",
        });
      } finally {
        setIsUploading(false);
      }
    }
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleDelete = async (file: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent image selection when clicking delete
    try {
        await deleteFile(file.ref);
        toast({
            title: "Image Deleted",
            description: `${file.name} has been removed from the library.`,
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        toast({
            variant: "destructive",
            title: "Deletion failed",
            description: "Could not delete the selected file.",
        });
    }
  };

  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
    onSelect(url);
  };

  return (
    <div className="flex flex-col h-[70vh]">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Media Library</h2>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2" />}
                {isUploading ? 'Uploading...' : 'Upload New Media'}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
        </div>
        
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && files.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-center bg-muted/50 rounded-lg">
                <div className="p-8">
                    <h3 className="text-lg font-medium">Your library is empty</h3>
                    <p className="text-muted-foreground mt-2">Upload some images to get started.</p>
                </div>
            </div>
        )}

        {!loading && files.length > 0 && (
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map((file) => (
                        <div
                            key={file.url}
                            className="relative group aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-transparent transition-all"
                            onClick={() => handleImageSelect(file.url)}
                        >
                            <Image
                                src={file.url}
                                alt={file.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                <p className="text-white text-xs text-center break-all">{file.name}</p>
                            </div>
                            {selectedImage === file.url && (
                                <div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none">
                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            )}

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 left-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the image
                                        <strong className="font-bold"> {file.name} </strong>
                                        from your library.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={(e) => handleDelete(file, e)}>
                                        Continue
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
