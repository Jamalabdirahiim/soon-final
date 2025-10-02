"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export default function LogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file (e.g., PNG, JPG, SVG).",
        });
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        try {
          localStorage.setItem('userLogo', result);
          window.dispatchEvent(new Event('logoChanged'));
          toast({
            title: "Logo updated!",
            description: "Your new logo has been applied.",
          });
        } catch (error) {
           toast({
            variant: "destructive",
            title: "Could not save logo",
            description: "Your browser's storage might be full. Please try again.",
          });
        } finally {
            setIsUploading(false);
        }
      };
      reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Error reading file",
            description: "Could not read the selected file. Please try again.",
          });
          setIsUploading(false);
      }
      reader.readAsDataURL(file);
    }
     // Reset file input to allow re-uploading the same file
    event.target.value = '';
  };

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:px-6">
        <Button onClick={handleButtonClick} disabled={isUploading}>
          <Upload className="mr-2" />
          {isUploading ? "Uploading..." : "Upload Your Logo"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Recommended size: 200x56px. Max file size: 2MB.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/svg+xml, image/webp"
        />
      </div>
    </section>
  );
}
