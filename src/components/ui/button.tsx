import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'royal' | 'outline' | 'ghost' | 'whatsapp' | 'call' | 'light' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-white shadow-card hover:bg-brand-800 hover:shadow-card-hover hover:-translate-y-0.5',
  royal:
    'bg-royal-700 text-white shadow-card hover:bg-royal-800 hover:shadow-card-hover hover:-translate-y-0.5',
  outline:
    'border border-brand-700/25 bg-white text-brand-800 hover:border-brand-700/50 hover:bg-brand-50',
  ghost: 'text-brand-800 hover:bg-brand-50',
  whatsapp:
    'bg-[#1FA855] text-white shadow-card hover:bg-[#178a45] hover:shadow-card-hover hover:-translate-y-0.5',
  call: 'bg-white text-brand-800 border border-white/40 shadow-card hover:bg-brand-50',
  light:
    'bg-white/12 text-white border border-white/25 backdrop-blur hover:bg-white/20 hover:-translate-y-0.5',
  danger: 'bg-alert text-white hover:bg-[#a93226]',
};

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[0.8125rem]',
  md: 'px-5 py-2.5 text-[0.9375rem]',
  lg: 'px-6 py-3.5 text-base',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
  full,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  full?: boolean;
} = {}) {
  return cn(base, variants[variant], sizes[size], full && 'w-full', className);
}

export type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  full?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
  prefetch?: boolean;
  onClick?: () => void;
  id?: string;
};

/**
 * One link component for every CTA. Internal paths use <Link>; tel:, mailto:,
 * https:// and wa.me links render as plain anchors with correct rel attributes.
 */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  full,
  children,
  ariaLabel,
  prefetch,
  onClick,
  id,
}: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, className, full });
  const isInternal = href.startsWith('/') && !href.startsWith('//');

  if (isInternal) {
    return (
      <Link
        id={id}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        prefetch={prefetch}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      id={id}
      href={href}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      {...(isExternal
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {children}
    </a>
  );
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
};

export function Button({ variant = 'primary', size = 'md', full, className, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={buttonStyles({ variant, size, className, full })}
      {...props}
    />
  );
}
