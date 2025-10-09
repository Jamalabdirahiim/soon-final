
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SoonLogo } from "@/components/soon-logo";
import { cn } from "@/lib/utils";
import { content } from "@/lib/content";
import { useUser } from "@/firebase";
import { ADMIN_EMAILS } from "@/lib/admin";


const defaultLogo = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAyMDAgNTYiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSIxMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIzNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDdEQjYiPgpTT09OPC90ZXh0Pgo8L3N2Zz4K`;

interface HeaderProps {
  logoUrl?: string | null;
}

export default function Header({ logoUrl: initialLogoUrl }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { user } = useUser();
  
  // Use the logoUrl passed from the server-side props, with a fallback.
  const logoUrl = initialLogoUrl || defaultLogo;

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check scroll position on initial render

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        hasScrolled || isMobileMenuOpen ? "bg-background/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between">
        <SoonLogo 
          logoSrc={logoUrl} 
          className={cn(
            // Apply inverted brightness for dark hero image background, but only when not scrolled and menu is closed
            !hasScrolled && !isMobileMenuOpen ? "brightness-0 invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" : ""
          )}
        />

        <nav
          className={cn(
            "hidden items-center gap-6 md:flex transition-colors duration-300",
            !hasScrolled ? "text-white" : "text-foreground/80"
          )}
        >
          {content.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-300",
                  !hasScrolled && !isMobileMenuOpen ? "text-white hover:bg-white/10 hover:text-white" : ""
                )}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <div className="flex h-full flex-col p-6">
                <div className="mb-8">
                  <SoonLogo logoSrc={logoUrl} />
                </div>
                <nav className="flex flex-col gap-6">
                  {content.navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                      onClick={closeMobileMenu} // Close menu on navigation
                    >
                      {link.label}
                    </Link>
                  ))}
                   {isAdmin && (
                    <Link
                      href="/admin/dashboard/settings"
                      className="flex items-center gap-2 text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                      onClick={closeMobileMenu}
                    >
                      <Shield className="h-5 w-5" />
                      Admin
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
