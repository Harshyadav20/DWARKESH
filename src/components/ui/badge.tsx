import { cn } from '@/lib/utils';

type Tone = 'brand' | 'leaf' | 'royal' | 'neutral' | 'light';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-800 ring-brand-100',
  leaf: 'bg-leaf-50 text-leaf-800 ring-leaf-100',
  royal: 'bg-royal-50 text-royal-800 ring-royal-100',
  neutral: 'bg-ink-50 text-ink-700 ring-ink-100',
  light: 'bg-white/10 text-white ring-white/20',
};

export function Badge({
  children,
  tone = 'brand',
  className,
  icon,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-bold uppercase tracking-[0.1em] ring-1',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
