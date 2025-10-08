
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogoUploader from "@/components/sections/logo-uploader";
import HeroImageUploader from "@/components/sections/hero-image-uploader";
import { Separator } from "@/components/ui/separator";
import MobileHeroImageUploader from "@/components/mobile-hero-image-uploader";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";

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
                            Update your site's branding and imagery. Changes are saved instantly.
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

                        <div className="space-y-2 pt-8">
                           <h2 className="text-xl font-semibold">IPTV Section Images</h2>
                           <Separator />
                        </div>
                         <div className="grid md:grid-cols-2 gap-8">
                            <FeatureImageUploader />
                            <MobileFeatureImageUploader />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
