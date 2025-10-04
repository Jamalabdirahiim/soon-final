"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useFirebaseApp } from '@/firebase/provider';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type MediaFile = {
  name: string;
  url: string;
};

interface MediaLibraryProps {
  onSelect: (url: string) => void;
}

export function MediaLibrary({ onSelect }: MediaLibraryProps) {
  const app = useFirebaseApp();
  const storage = app ? getStorage(app) : null;
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const listFiles = async () => {
    if (!storage) return;
    setLoading(true);
    try {
      const listRef = ref(storage, 'images');
      const res = await listAll(listRef);
      const filesWithUrls = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );
      // Sort by name to show newest first if using timestamps in name
      filesWithUrls.sort((a, b) => b.name.localeCompare(a.name));
      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error listing files:", error);
      toast({
        variant: "destructive",
        title: "Error fetching media",
        description: "Could not load images from the library.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storage) {
      listFiles();
    } else {
        setLoading(false);
    }
  }, [storage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && storage) {
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
        const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);
        await uploadBytes(imageRef, file);
        toast({
          title: "Upload successful",
          description: `${file.name} has been added to the library.`,
        });
        await listFiles(); // Refresh the list
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          variant: "destructive",
          title: "Error uploading file",
          description: "Could not upload the selected file.",
        });
      } finally {
        setIsUploading(false);
      }
    }
     if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Media Library</h3>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || !storage}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload New Media
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
            />
        </div>
        <Card>
            <CardContent className="p-4">
            {loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-md" />
                    ))}
                </div>
            ) : files.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-h-[50vh] overflow-y-auto">
                {files.map((file) => (
                    <button
                        key={file.url}
                        className="relative aspect-square group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                        onClick={() => onSelect(file.url)}
                    >
                    <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover rounded-md transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                        <span className="text-white text-xs text-center p-1">Select</span>
                    </div>
                    </button>
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Your media library is empty.</p>
                    <p className="text-sm text-muted-foreground">Upload your first image to get started.</p>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
