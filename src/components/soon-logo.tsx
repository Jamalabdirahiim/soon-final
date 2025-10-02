import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SoonLogo({ logoUrl, className }: { logoUrl?: string; className?: string }) {
  const content = logoUrl ? (
    <Image 
      src={logoUrl}
      alt="SOON Logo" 
      width={100} 
      height={28}
      priority
      className="h-7 w-auto"
      data-ai-hint="minimalist logo"
    />
  ) : (
    <span className={cn('text-2xl font-black font-headline text-primary', className)}>
      SOON
    </span>
  );

  return (
    <Link href="/" aria-label="Back to homepage">
      {content}
    </Link>
  );
}
