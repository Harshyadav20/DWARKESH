import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession, isAdminConfigured } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';
import { Logo } from '@/components/brand/logo';
import { buttonStyles } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { default: 'Admin — Dwarkesh Medical Centre', template: '%s — Admin' },
  description: 'Admin dashboard for Dwarkesh Medical Centre LLP website content.',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-brand-900/10 bg-white p-8 shadow-card">
          <Logo size="md" />
          <h1 className="mt-6 font-display text-xl font-extrabold text-brand-950">
            Admin panel is not configured
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            To protect the clinic’s content, the dashboard only turns on once a password is set.
            Add these environment variables and restart the server:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-ink-900 p-4 text-xs leading-relaxed text-brand-100">
            {`ADMIN_PASSWORD=choose-a-strong-password\nAUTH_SECRET=any-long-random-string`}
          </pre>
          <p className="mt-4 text-sm text-ink-600">
            See <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">.env.example</code> and the
            README for the full list, including the Supabase connection needed to persist edits in
            production.
          </p>
          <Link href="/" className={buttonStyles({ variant: 'primary', size: 'md', className: 'mt-6' })}>
            Back to the website
          </Link>
        </div>
      </div>
    );
  }

  const authorized = await getCurrentSession();
  if (!authorized) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
