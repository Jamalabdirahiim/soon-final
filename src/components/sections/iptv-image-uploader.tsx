
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureImageUploader } from "@/components/feature-image-uploader";

export default function IptvImageUploader() {
    return (
        <section className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">IPTV Section Image</CardTitle>
                        <CardDescription>
                            Update the image for the IPTV section. The image should be high quality. Changes are saved instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FeatureImageUploader />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
