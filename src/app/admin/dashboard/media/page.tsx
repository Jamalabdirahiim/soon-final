
import LogoUploader from "@/components/logo-uploader";
import { HeroImageUploader } from "@/components/hero-image-uploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileLogoUploader } from "@/components/mobile-logo-uploader";
import { MobileHeroImageUploader } from "@/components/mobile-hero-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";

export default function MediaPage() {
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Site Customization</CardTitle>
                <CardDescription>Upload your own assets to customize the look and feel of your site.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8">
                <div className="space-y-8">
                    <LogoUploader />
                    <MobileLogoUploader />
                </div>
                <div className="space-y-8">
                    <HeroImageUploader />
                    <MobileHeroImageUploader />
                </div>
                <div className="space-y-8">
                    <FeatureImageUploader />
                    <MobileFeatureImageUploader />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
