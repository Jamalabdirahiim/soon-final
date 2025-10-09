
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogoUploader from "@/components/sections/logo-uploader";
import HeroImageUploader from "@/components/sections/hero-image-uploader";
import { Separator } from "@/components/ui/separator";
import MobileHeroImageUploader from "@/components/mobile-hero-image-uploader";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Customization() {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
        <section className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">Site Customization</CardTitle>
                        <CardDescription>
                            Update your site's branding and imagery. Changes are saved instantly and will appear on refresh.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                           <h2 className="text-xl font-semibold">Branding</h2>
                           <Separator />
                        </div>
                        <LogoUploader />
                        
                        <div className="space-y-2 pt-8">
                           <h2 className="text-xl font-semibold">Hero Section Images</h2>
                           <Separator />
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <HeroImageUploader />
                            <MobileHeroImageUploader />
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Upload IPTV Image</Button>
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

                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
