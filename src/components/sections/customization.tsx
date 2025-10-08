
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogoUploader from "@/components/sections/logo-uploader";
import { Separator } from "@/components/ui/separator";
import HeroImageUploader from "@/components/sections/hero-image-uploader";
import MobileHeroImageUploader from "@/components/mobile-hero-image-uploader";

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
                            Update your branding and hero images. Changes are saved instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <LogoUploader />
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-8">
                            <HeroImageUploader />
                            <MobileHeroImageUploader />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
