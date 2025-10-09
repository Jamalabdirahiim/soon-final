"use client";

import Image from "next/image";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { placeholderImages } from "@/lib/placeholder-images.json";

const IptvHero = () => {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const [imageUrl, setImageUrl] = useState<string>(defaultIptvImage?.imageUrl || "/iptv-hero.jpg");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to fetch the image URL from Firebase Storage on page load
  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, 'hero/iptv-hero.jpg');

    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        // Image does not exist yet, so we keep the default.
        console.log("IPTV hero image not found in storage, using default.", error.code);
      });
  }, []);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, 'hero/iptv-hero.jpg');

      try {
        // Upload the file
        await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Update the image on the page
        setImageUrl(downloadURL);

        // Show success message
        setConfirmation("IPTV image updated successfully.");
        setTimeout(() => setConfirmation(null), 3000);

      } catch (error) {
        console.error("Upload failed:", error);
        setConfirmation("Image upload failed.");
        setTimeout(() => setConfirmation(null), 3000);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full h-[80vh] rounded-xl">
        <Image
          src={imageUrl}
          alt={"IPTV service hero image"}
          fill
          className="object-cover w-full h-full rounded-xl"
          key={imageUrl} // Force re-render when src changes
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />
      <Button
        onClick={handleButtonClick}
        variant="default"
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
      >
        Change IPTV Image
      </Button>
      {confirmation && <p className="text-sm text-green-600 mt-2">{confirmation}</p>}
    </div>
  );
};

export default IptvHero;
