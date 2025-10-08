
"use client";

// This is a placeholder component.
// The full media library will be built as part of the admin dashboard feature.

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MediaLibrary({ onSelect }: { onSelect: (url: string) => void }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <h3 className="font-semibold">Media Library</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            This feature is coming soon. For now, you can upload images directly from the customization panel.
          </p>
          <Button onClick={() => onSelect('')} variant="outline" disabled>
            Select Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
