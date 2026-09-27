'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      className={cn(
        'flex min-h-11 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-brand-100/80 transition-colors hover:bg-white/10 hover:text-white',
        compact && 'flex-1 bg-white/10 text-white',
      )}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Log out
    </button>
  );
}
