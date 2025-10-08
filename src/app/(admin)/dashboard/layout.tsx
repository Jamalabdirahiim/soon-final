
"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { SoonLogo } from "@/components/soon-logo";
import { LogOut, UploadCloud, Images, Palmtree, Image } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
  
  const isActive = (path: string) => pathname === path;

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SoonLogo hasScrolled={true} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/dashboard')} isActive={isActive('/dashboard')}>
                  <Palmtree />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/dashboard/media')} isActive={isActive('/dashboard/media')}>
                  <Images />
                  Media
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start">
              <LogOut className="mr-2" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}
