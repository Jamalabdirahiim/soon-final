"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SoonLogo } from "@/components/soon-logo";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type NavLink = {
  label: string;
  href: string;
};

interface HeaderProps {
  navLinks: NavLink[];
}

export default function Header({ navLinks }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('home');
      if (heroSection) {
        // A bit more than header height
        setHasScrolled(window.scrollY > 80);
      } else {
        setHasScrolled(window.scrollY > 50);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);


  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        hasScrolled || isMobile ? "bg-background/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
            <SoonLogo hasScrolled={hasScrolled || isMobile} />
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                hasScrolled ? "text-foreground/80" : "text-primary-foreground/80 hover:text-primary-foreground drop-shadow-sm"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant={hasScrolled ? 'outline' : 'outline-white'}>
            <Link href="/admin">Admin</Link>
          </Button>
        </div>

        <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "text-foreground hover:bg-accent hover:text-accent-foreground", 
                  !hasScrolled && !isMobile && "text-white hover:text-white hover:bg-white/10"
                )}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
                <div className="flex h-full flex-col p-6">
                <div className="mb-8">
                    <SoonLogo hasScrolled={true} />
                </div>
                <nav className="flex flex-col gap-6">
                    {navLinks.map((link) => (
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
                <div className="mt-auto">
                    <Button asChild className="w-full">
                    <Link href="/admin" onClick={handleLinkClick}>Admin</Link>
                    </Button>
                </div>
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
