
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import LogoUploader from "@/components/logo-uploader"
import { HeroImageUploader } from "@/components/hero-image-uploader"
import { MobileHeroImageUploader } from "@/components/mobile-hero-image-uploader"
import { FeatureImageUploader } from "@/components/feature-image-uploader"
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Customization</h1>
        <p className="text-muted-foreground">
          Update your site's branding and images in real-time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Upload your company logo. This will appear in the header. For best results, use a transparent PNG or SVG.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogoUploader />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Images</CardTitle>
          <CardDescription>
            Manage the main background images for your homepage hero section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <HeroImageUploader />
          <Separator />
          <MobileHeroImageUploader />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>IPTV Section Images</CardTitle>
          <CardDescription>
            Manage the images for the IPTV section on your homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeatureImageUploader />
           <Separator />
          <MobileFeatureImageUploader />
        </CardContent>
      </Card>
    </div>
  )
}
