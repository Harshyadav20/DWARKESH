import { cn } from '@/lib/utils';

/**
 * Brand lockup: SVG mark + wordmark (rendered as real text so it stays
 * accessible, selectable and consistent with the site typography).
 *
 * The mark is the same artwork as /public/logo.svg.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn('h-10 w-10 shrink-0', className)}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="dmc-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f7486" />
          <stop offset="0.55" stopColor="#1d5e6d" />
          <stop offset="1" stopColor="#1e328a" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#dmc-logo-bg)" />
      <path d="M216 104h80v112h112v80H296v112h-80V296H104v-80h112z" fill="#ffffff" />
      <path
        d="M86 372h74l30-52 44 96 36-70 24 26h132"
        fill="none"
        stroke="#55bd7f"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  variant?: 'dark' | 'light';
  showHindi?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function Logo({ className, variant = 'dark', showHindi = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { mark: 'h-8 w-8', name: 'text-[0.95rem]', sub: 'text-[0.6rem]', hindi: 'text-[0.6rem]' },
    md: { mark: 'h-11 w-11', name: 'text-[1.05rem]', sub: 'text-[0.65rem]', hindi: 'text-[0.65rem]' },
    lg: { mark: 'h-14 w-14', name: 'text-[1.35rem]', sub: 'text-[0.75rem]', hindi: 'text-[0.8rem]' },
  }[size];

  const nameColor = variant === 'light' ? 'text-white' : 'text-brand-900';
  const subColor = variant === 'light' ? 'text-brand-100/80' : 'text-ink-500';

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <LogoMark className={sizes.mark} />
      <span className="flex flex-col leading-none">
        <span className={cn('font-display font-extrabold tracking-tight', sizes.name, nameColor)}>
          DWARKESH
        </span>
        <span
          className={cn(
            'mt-1 font-semibold uppercase tracking-[0.14em]',
            sizes.sub,
            subColor,
          )}
        >
          Medical Centre <span className="font-medium">LLP</span>
        </span>
        {showHindi && (
          <span
            lang="hi"
            className={cn('font-devanagari mt-1 leading-tight', sizes.hindi, subColor)}
          >
            द्वारकेश मेडिकल सेंटर एल एल पी
          </span>
        )}
      </span>
    </span>
  );
}
