
"use client";

import { useState } from 'react';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import LogoUploader from '@/components/sections/logo-uploader';
import HeroImageUploader from './hero-image-uploader';
import MobileHeroImageUploader from './mobile-hero-image-uploader';
import { IptvImageUploader } from './iptv-image-uploader';

export default function Customization() {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
        <section id="customization" className="bg-muted py-12">
            <div className="container mx-auto px-4 md:px-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Settings className="h-6 w-6" />
                                <span>Site Customization</span>
                            </CardTitle>
                            <p className="text-muted-foreground">
                                Upload your logo and hero images here.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-8 pt-2">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Logo</h3>
                            <LogoUploader />
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Hero Image (Desktop)</h3>
                                <HeroImageUploader />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Hero Image (Mobile)</h3>
                                <MobileHeroImageUploader />
                            </div>
                        </div>

                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Upload IPTV Image</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Upload IPTV Image</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                     <IptvImageUploader />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
