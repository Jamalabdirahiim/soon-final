
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";

export default function IptvImageUploader() {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
        <section className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">IPTV Section Images</CardTitle>
                        <CardDescription>
                            Update the images for the IPTV section for both desktop and mobile views. Changes are saved instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <FeatureImageUploader />
                        <MobileFeatureImageUploader />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
