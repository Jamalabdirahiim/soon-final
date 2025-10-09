
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageIcon, Settings } from "lucide-react";
import { AdminOnly } from "@/components/auth/admin-only";

export default function AdminDashboard() {

  return (
    <AdminOnly>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Media Management
                    </CardTitle>
                    <CardDescription>
                        View, upload, and delete images used across the website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/admin/dashboard/media">Manage Media</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Site Settings
                    </CardTitle>
                    <CardDescription>
                        Modify site configuration, text content, and other settings. (Coming Soon)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button disabled>
                        Go to Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminOnly>
  );
}
