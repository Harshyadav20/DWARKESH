'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Scroll-reveal wrapper.
 *
 * Uses IntersectionObserver, adds a single fast fade/translate, honours
 * `prefers-reduced-motion`, and degrades to "always visible" so content is
 * never hidden if JS or the observer is unavailable.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
  y?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn('transition-[opacity,transform] duration-500 ease-out will-change-transform motion-reduce:transition-none', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
