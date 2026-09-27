import Link from 'next/link';
import { ArrowLeft, Home, Phone } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { buttonStyles } from '@/components/ui/button';
import { contact } from '@/lib/site';
import { callHref } from '@/lib/links';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-brand-50/60 px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <p className="mt-8 font-display text-6xl font-extrabold tracking-tight text-brand-800">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-brand-950">
          We couldn’t find that page
        </h1>
        <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-600">
          The page may have moved. You can jump back to the home page, browse our services, or call
          the centre and we’ll point you in the right direction.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonStyles({ variant: 'primary', size: 'md' })}>
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
          <Link href="/services" className={buttonStyles({ variant: 'outline', size: 'md' })}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            View Services
          </Link>
          <a href={callHref} className={buttonStyles({ variant: 'ghost', size: 'md' })}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {contact.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
