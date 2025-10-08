
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LogoUploader from "@/components/sections/logo-uploader"
import { HeroImageUploader } from "@/components/hero-image-uploader"

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
          <CardTitle>Hero Image</CardTitle>
          <CardDescription>
            Manage the main background image for your homepage hero section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HeroImageUploader />
        </CardContent>
      </Card>
    </div>
  )
}
