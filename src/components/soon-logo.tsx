import Image from 'next/image';
import Link from 'next/link';

export function SoonLogo({ className }: { className?: string }) {
  const content = (
    <Image 
      src="/logo.png"
      alt="SOON Logo" 
      width={100} 
      height={28}
      priority
      className="h-7 w-auto"
      data-ai-hint="minimalist logo"
    />
  );

  return (
    <Link href="/" aria-label="Back to homepage" className={className}>
      {content}
    </Link>
  );
}
