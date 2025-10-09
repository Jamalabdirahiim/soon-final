
"use client";

import { AdminOnly } from "@/components/auth/admin-only";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import LogoUploader from "@/components/sections/logo-uploader";
import HeroImageUploader from "@/components/sections/hero-image-uploader";
import MobileHeroImageUploader from "@/components/sections/mobile-hero-image-uploader";
import { IptvImageUploader } from "@/components/sections/iptv-image-uploader";

export default function SiteSettingsPage() {
  return (
    <AdminOnly>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Site Customization
          </h2>
        </div>
        
        <Tabs defaultValue="logo" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logo">Site Logo</TabsTrigger>
            <TabsTrigger value="images">Homepage Images</TabsTrigger>
          </TabsList>

          <TabsContent value="logo">
            <Card>
                <CardHeader>
                    <CardTitle>Site Logo</CardTitle>
                    <CardDescription>Upload a logo for the site. It will be displayed in the header and footer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LogoUploader />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <div className="space-y-8">
              <Card>
                  <CardHeader>
                      <CardTitle>Homepage Hero Images</CardTitle>
                      <CardDescription>Upload images for the main hero section on the homepage. Provide versions for both desktop and mobile screens.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-8">
                      <div>
                          <h3 className="text-lg font-semibold mb-2">Desktop Hero Image</h3>
                          <HeroImageUploader />
                      </div>
                      <div>
                          <h3 className="text-lg font-semibold mb-2">Mobile Hero Image</h3>
                          <MobileHeroImageUploader />
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>IPTV Section Image</CardTitle>
                      <CardDescription>Upload the main image for the IPTV promotional section. This image will be used for both desktop and mobile.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <IptvImageUploader />
                  </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </AdminOnly>
  );
}
