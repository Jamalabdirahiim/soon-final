import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SoonLogo({ className, logoSrc = "/logo.png" }: { className?: string, logoSrc?: string }) {
  const content = (
    <Image 
      src={logoSrc}
      alt="SOON Logo" 
      width={100} 
      height={28}
      priority
      className="h-7 w-auto"
      data-ai-hint="minimalist logo"
    />
  );

  return (
    <Link href="/" aria-label="Back to homepage">
      {content}
    </Link>
  );
}
