
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useStorage, useUser } from "@/firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
  type StorageReference,
} from "firebase/storage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2, X, AlertTriangle } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { ADMIN_EMAILS } from "@/lib/admin";

interface ImageItem {
  url: string;
  ref: StorageReference;
  name: string;
}

// This component provides a full media library management interface.
// It allows admins to view, upload, and delete images from Firebase Cloud Storage.
export function MediaLibrary({ onSelect }: { onSelect: (url: string) => void }) {
  const { user } = useUser();
  const storage = useStorage();
  const { toast } = useToast();

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  // Fetches all images from the 'hero/' folder in Cloud Storage.
  const fetchImages = useCallback(async () => {
    if (!storage) return;
    setLoading(true);
    try {
      const heroFolderRef = ref(storage, 'hero/');
      const res = await listAll(heroFolderRef);
      const promises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { url, ref: itemRef, name: itemRef.name };
      });
      const fetchedImages = await Promise.all(promises);
      setImages(fetchedImages);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load images from storage.",
      });
    } finally {
      setLoading(false);
    }
  }, [storage, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchImages();
    }
  }, [isAdmin, fetchImages]);

  // Handles the file upload process.
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

    setUploading(true);
    const imageRef = ref(storage, `hero/${file.name}`);

    try {
      await uploadBytes(imageRef, file);
      await fetchImages(); // Refresh the list after upload
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded.`,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload the image.",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handles the image deletion process.
  const handleDelete = async (imageToDelete: ImageItem) => {
    try {
      await deleteObject(imageToDelete.ref);
      setImages((prevImages) => prevImages.filter((img) => img.url !== imageToDelete.url));
      toast({
        title: "Image Deleted",
        description: `${imageToDelete.name} has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the image.",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg bg-red-50 border-red-200 text-red-700">
        <AlertTriangle className="mx-auto h-12 w-12" />
        <h3 className="mt-4 font-semibold text-lg">Access Denied</h3>
        <p className="text-sm mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div key={image.url} className="group relative aspect-square">
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the image
                        <span className="font-bold"> {image.name}</span> from storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(image)}>
                        Yes, delete it
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
       { !loading && images.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="font-semibold">No Images Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Upload an image to get started. Images in the 'hero/' folder will appear here.
            </p>
          </div>
        )}
    </div>
  );
}
