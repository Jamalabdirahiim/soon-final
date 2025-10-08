
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogoUploader from "@/components/sections/logo-uploader";
import { Separator } from "@/components/ui/separator";
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
                            Update your branding. Changes are saved instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <LogoUploader />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
