'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { buttonStyles } from '@/components/ui/button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (response.ok && data.ok) {
        router.push(next.startsWith('/admin') ? next : '/admin');
        router.refresh();
      } else {
        setError(data.error ?? 'Could not sign in.');
      }
    } catch {
      setError('Network problem — please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50/60 px-5 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-brand-900/10 bg-white p-8 shadow-card">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>

          <h1 className="mt-7 text-center font-display text-xl font-extrabold text-brand-950">
            Admin sign in
          </h1>
          <p className="mt-2 text-center text-sm text-ink-600">
            Manage doctors, services, gallery, timings and appointment requests.
          </p>

          <form onSubmit={submit} className="mt-7" noValidate>
            <label htmlFor="admin-password" className="label">
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className="input pl-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your admin password"
                autoFocus
              />
            </div>

            {error && (
              <p className="error-text mt-3" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || password.length === 0}
              className={buttonStyles({ variant: 'primary', size: 'lg', full: true, className: 'mt-5' })}
            >
              {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Lock className="h-5 w-5" aria-hidden="true" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-ink-500">
            Sessions expire automatically after a few hours. The password is stored only as an
            environment variable on the server.
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to the website
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
