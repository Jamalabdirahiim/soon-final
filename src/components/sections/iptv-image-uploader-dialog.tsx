
"use client";

import React, { useState } from 'react';
import { useUser } from '@/firebase';
import { ADMIN_EMAILS } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { IptvImageUploader } from './iptv-image-uploader';

export function IptvImageUploaderDialog() {
    const { user } = useUser();
    const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");
    const [open, setOpen] = useState(false);

    if (!isAdmin) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="secondary" 
                    className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <Camera className="mr-2 h-4 w-4" />
                    Edit Image
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload IPTV Image</DialogTitle>
                </DialogHeader>
                <IptvImageUploader onUploadComplete={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
