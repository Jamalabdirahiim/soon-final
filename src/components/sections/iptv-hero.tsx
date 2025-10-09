
'use client';

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";

interface IptvHeroProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

const IptvHero = ({ featureImageUrl, mobileFeatureImageUrl }: IptvHeroProps) => {
    const isMobile = useIsMobile();
    const { user } = useUser();

    const getSrc = () => {
        if (isMobile === undefined) return null; 
        
        const desktopSrc = featureImageUrl;
        const mobileSrc = mobileFeatureImageUrl || desktopSrc;
        
        return isMobile ? mobileSrc : desktopSrc;
    };

    const imageUrl = getSrc();

    if (isMobile === undefined) {
        return (
            <section className="flex flex-col items-center">
                <Skeleton className="w-full h-[80vh] rounded-xl" />
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center" id="iptv">
            <div className="w-full h-[80vh] relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="IPTV Service Showcase"
                        fill
                        className="object-contain w-full h-full"
                        key={imageUrl}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-16 w-16" />
                        <h3 className="mt-4 text-lg font-semibold">IPTV Image Not Set</h3>
                        {user ? (
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button variant="outline" className="mt-4">
                                 <Upload className="mr-2 h-4 w-4" />
                                 Upload IPTV Image
                               </Button>
                             </DialogTrigger>
                             <DialogContent className="sm:max-w-[800px]">
                               <DialogHeader>
                                 <DialogTitle>Upload IPTV Images</DialogTitle>
                                 <DialogDescription>
                                   Upload separate images for desktop and mobile viewports. Your changes will be saved and applied instantly.
                                 </DialogDescription>
                               </DialogHeader>
                               <div className="grid md:grid-cols-2 gap-8 py-4">
                                   <FeatureImageUploader />
                                   <MobileFeatureImageUploader />
                               </div>
                             </DialogContent>
                           </Dialog>
                        ) : (
                           <p className="mt-2 text-sm">An admin can upload an image in the customization panel.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default IptvHero;
