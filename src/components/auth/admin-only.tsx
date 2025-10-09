
"use client";

import { useUser } from "@/firebase";
import { ADMIN_EMAILS } from "@/lib/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

/**
 * A client component that acts as a gatekeeper for admin-only content.
 * It checks if the currently authenticated user's email is in the ADMIN_EMAILS list.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render if the user is an admin.
 * @returns {React.ReactNode} The children if the user is an admin, a loading state, or an access denied message.
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  // Show a loading state while user authentication is being checked.
  if (loading) {
    return (
       <div className="w-full h-screen flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
         </div>
       </div>
    );
  }

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  // If the user is an admin, render the protected content.
  if (isAdmin) {
    return <>{children}</>;
  }

  // If the user is not an admin, show an access denied message.
  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
       <div className="text-center p-8 border-2 border-dashed rounded-lg bg-red-50 border-red-200 text-red-700 max-w-md">
        <AlertTriangle className="mx-auto h-12 w-12" />
        <h3 className="mt-4 font-semibold text-lg">Access Denied</h3>
        <p className="text-sm mt-2">
            You do not have permission to view this page. Please contact an administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
