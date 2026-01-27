
"use client";

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ADMIN_EMAILS } from '@/lib/admin';

export default function Customization() {
    const { user } = useUser();
    const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

    if (!isAdmin) {
        return null;
    }

    return (
        <section id="customization" className="bg-muted py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8">
                    <Card className="border-primary border-2 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <LayoutDashboard className="h-6 w-6" />
                                    <span>Admin Dashboard</span>
                                </CardTitle>
                                <CardDescription className="text-base">
                                    You are logged in as an administrator. Manage your site&apos;s content, images, and settings from the dashboard.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button asChild size="lg">
                                <Link href="/admin/dashboard/settings">Go to Site Settings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
