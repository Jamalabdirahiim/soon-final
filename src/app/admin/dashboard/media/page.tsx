
import { AdminOnly } from "@/components/auth/admin-only";
import { MediaLibrary } from "./media-library";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export default function MediaDashboardPage() {
  return (
    <AdminOnly>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <span>Stored Images</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MediaLibrary onSelect={() => {}} />
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
