"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export function MobileLogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const saveLogo = (logoData: string) => {
    try {
      localStorage.setItem('mobileLogo', logoData);
      window.dispatchEvent(new Event('mobileLogoChanged'));
      toast({
        title: "Mobile logo updated!",
        description: "Your new mobile logo has been applied.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Could not save logo",
        description: "Your browser's storage might be full. Please try again.",
      });
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 1MB.",
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
        saveLogo(result);
        setIsUploading(false);
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
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
        <h3 className="font-medium">Mobile Logo</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={handleButtonClick} disabled={isUploading} variant="outline">
            <Upload className="mr-2" />
            {isUploading ? "Uploading..." : "Upload Mobile Logo"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended size: 150x42px. Max file size: 1MB.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/svg+xml, image/webp"
        />
    </div>
  );
}
