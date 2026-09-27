import { cn } from '@/lib/utils';

type Tone = 'light' | 'dark';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
  titleClassName,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  tone?: Tone;
  className?: string;
  titleClassName?: string;
  id?: string;
}) {
  const isDark = tone === 'dark';
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-2xs font-bold uppercase tracking-[0.16em]',
            isDark ? 'bg-white/10 text-brand-100' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isDark ? 'bg-leaf-300' : 'bg-leaf-500',
            )}
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          'font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]',
          isDark ? 'text-white' : 'text-brand-950',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed',
            align === 'center' && 'mx-auto',
            isDark ? 'text-brand-100/85' : 'text-ink-600',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  tone = 'light',
  ariaLabelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: Tone;
  ariaLabelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'relative scroll-mt-28 py-16 sm:py-20 lg:py-24',
        tone === 'dark' ? 'bg-brand-900 text-white' : 'bg-white',
        className,
      )}
    >
      {children}
    </section>
  );
}
