
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import React from "react";

interface ImageUploaderDialogProps {
  triggerText: string;
  dialogTitle: string;
  children: React.ReactNode;
}

export function ImageUploaderDialog({ triggerText, dialogTitle, children }: ImageUploaderDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="transition-transform hover:scale-105">
          <Camera className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
