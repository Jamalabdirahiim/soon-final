
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoUploader } from "@/components/logo-uploader";
import { MobileLogoUploader } from "@/components/mobile-logo-uploader";
import { HeroImageUploader } from "@/components/hero-image-uploader";
import { MobileHeroImageUploader } from "@/components/mobile-hero-image-uploader";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";
import { MediaLibrary } from "@/app/admin/dashboard/media/media-library";

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Site Customization</CardTitle>
                    <CardDescription>
                        Update your site's logos and images. Changes will be reflected live.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="desktop">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="desktop">Desktop</TabsTrigger>
                            <TabsTrigger value="mobile">Mobile</TabsTrigger>
                        </TabsList>
                        <TabsContent value="desktop" className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <LogoUploader />
                                </div>
                                <div className="space-y-6">
                                    <HeroImageUploader />
                                </div>
                                <div className="space-y-6">
                                    <FeatureImageUploader />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="mobile" className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <MobileLogoUploader />
                                </div>
                                <div className="space-y-6">
                                    <MobileHeroImageUploader />
                                </div>
                                <div className="space-y-6">
                                    <MobileFeatureImageUploader />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Media Library</CardTitle>
                    <CardDescription>Manage all your uploaded media assets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MediaLibrary onSelect={() => {}} />
                </CardContent>
            </Card>
        </div>
    );
}
