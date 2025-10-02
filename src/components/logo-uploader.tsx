"use client";

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save } from 'lucide-react';
import { Input } from './ui/input';

export default function LogoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const saveLogo = (logoData: string) => {
    try {
      localStorage.setItem('userLogo', logoData);
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
    }
  }

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

  const handleUrlSave = () => {
    if (!imageUrl) {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please enter a valid image URL.',
      });
      return;
    }
    // A simple check for image extensions.
    if (!/\.(jpg|jpeg|png|webp|svg)$/i.test(imageUrl)) {
        toast({
        variant: 'destructive',
        title: 'Invalid Image URL',
        description: 'URL must end with a valid image extension (jpg, png, webp, svg).',
      });
      return;
    }
    saveLogo(imageUrl);
    setImageUrl('');
  };

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={handleButtonClick} disabled={isUploading}>
            <Upload className="mr-2" />
            {isUploading ? "Uploading..." : "Upload Logo"}
          </Button>
          <div className="flex items-center gap-2">
            <Input 
              type="text" 
              placeholder="Or paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full sm:w-64"
            />
             <Button onClick={handleUrlSave} variant="outline">
              <Save className="mr-2" />
              Save URL
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
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
