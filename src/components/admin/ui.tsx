'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Doctor, GalleryItem, ServiceItem, SiteSettings } from '@/lib/types';

export type AdminContent = {
  storage: 'supabase' | 'file' | 'read-only';
  settings: SiteSettings;
  doctors: Doctor[];
  services: ServiceItem[];
  gallery: GalleryItem[];
};

export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: AdminContent };

/** Loads the editable content set once, and lets pages mutate + save it. */
export function useAdminContent() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' });
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!response.ok) throw new Error('Could not load content.');
      const data = (await response.json()) as AdminContent;
      setState({ status: 'ready', data });
    } catch {
      setState({ status: 'error', message: 'Could not load content. Please retry.' });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { state, reload: load, patch: (next: AdminContent) => setState({ status: 'ready', data: next }) };
}

export function AdminCard({
  title,
  description,
  children,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-2xl border border-brand-900/10 bg-white shadow-card', className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-900/8 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-bold text-brand-950">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-600">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-500">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export const adminInput =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15';

export function Toggle({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink-200 px-4 py-3 transition-colors hover:border-brand-300"
    >
      <span className="text-sm font-semibold text-ink-800">{label}</span>
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/30" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function SaveBar({
  dirty,
  saving,
  onSave,
  onReset,
  message,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
  message?: string | null;
}) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-brand-900/10 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={!dirty || saving}
            className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-50"
          >
            Discard
          </button>
        )}
        {message && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-leaf-700" role="status">
            {message}
          </p>
        )}
        {!dirty && !message && (
          <p className="text-sm text-ink-500">No unsaved changes.</p>
        )}
      </div>
    </div>
  );
}

export function StorageNotice({ storage }: { storage: AdminContent['storage'] }) {
  if (storage === 'supabase') return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">
        {storage === 'read-only' ? (
          <>
            <strong>Read-only storage.</strong> Changes cannot be saved on this host because neither
            Supabase nor a writable file system is available. Configure Supabase (see README) to
            persist edits in production.
          </>
        ) : (
          <>
            <strong>Local file storage.</strong> Edits are saved to <code>data/db.json</code> on this
            server. Connect Supabase before deploying so changes survive server restarts.
          </>
        )}
      </p>
    </div>
  );
}

export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-ink-600">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-brand-900/10 bg-white p-6 text-sm text-ink-600">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}
