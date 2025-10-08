
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SoonLogo } from "@/components/soon-logo";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { content } from "@/lib/content";

export default function Header({ logoUrl }: { logoUrl: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  const isScrolledOrMobileMenuOpen = hasScrolled || (isMobile && isMobileMenuOpen);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolledOrMobileMenuOpen ? "bg-background/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
            <SoonLogo hasScrolled={hasScrolled} logoSrc={logoUrl} />
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {content.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                !hasScrolled ? "text-primary-foreground/80 hover:text-primary-foreground drop-shadow-sm" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "hover:bg-accent hover:text-accent-foreground", 
                  !hasScrolled ? "text-white hover:text-white hover:bg-white/10" : "text-foreground"
                )}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
                <div className="flex h-full flex-col p-6">
                <div className="mb-8">
                    <SoonLogo hasScrolled={true} logoSrc={logoUrl} />
                </div>
                <nav className="flex flex-col gap-6">
                    {content.navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                        onClick={handleLinkClick}
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
