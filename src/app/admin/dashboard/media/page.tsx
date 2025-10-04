
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoUploader from "@/components/logo-uploader";
import { HeroImageUploader } from "@/components/hero-image-uploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileLogoUploader } from "@/components/mobile-logo-uploader";
import { MobileHeroImageUploader } from "@/components/mobile-hero-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";
import { MediaLibrary } from "./media-library";

export default function MediaPage() {
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Site Customization</CardTitle>
                <CardDescription>Upload your own assets to customize the look and feel of your site.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="desktop">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="desktop">Desktop</TabsTrigger>
                        <TabsTrigger value="mobile">Mobile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="desktop">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                            <LogoUploader />
                            <HeroImageUploader />
                            <FeatureImageUploader />
                        </div>
                    </TabsContent>
                    <TabsContent value="mobile">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                            <MobileLogoUploader />
                            <MobileHeroImageUploader />
                            <MobileFeatureImageUploader />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Media Library</CardTitle>
                <CardDescription>Manage all your uploaded media assets.</CardDescription>
            </CardHeader>
            <CardContent>
                <MediaLibrary onSelect={() => {}} />
            </CardContent>
        </Card>
    </div>
  );
}
