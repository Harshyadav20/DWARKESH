'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { PageHeading, StorageNotice } from '@/components/admin/ui';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from '@/lib/types';

const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

const statusStyles: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  confirmed: 'bg-leaf-50 text-leaf-800 ring-leaf-200',
  completed: 'bg-brand-50 text-brand-800 ring-brand-200',
  cancelled: 'bg-ink-50 text-ink-600 ring-ink-200',
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [storage, setStorage] = useState<'supabase' | 'file' | 'read-only'>('file');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/appointments', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { appointments: Appointment[] };
      setAppointments(data.appointments);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    void fetch('/api/admin/content', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { storage: typeof storage }) => setStorage(d.storage))
      .catch(() => undefined);
  }, [load]);

  const filtered = useMemo(
    () => (filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)),
    [appointments, filter],
  );

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    setBusyId(id);
    const response = await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) {
      setAppointments((current) => current.map((a) => (a.id === id ? { ...a, status } : a)));
    }
    setBusyId(null);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this appointment request permanently?')) return;
    setBusyId(id);
    const response = await fetch(`/api/admin/appointments?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setAppointments((current) => current.filter((a) => a.id !== id));
    }
    setBusyId(null);
  };

  const exportCsv = () => {
    const header = [
      'Reference',
      'Patient',
      'Phone',
      'Email',
      'Doctor',
      'Department',
      'Date',
      'Time',
      'Reason',
      'Status',
      'Created',
    ];
    const rows = filtered.map((a) => [
      a.id,
      a.patient_name,
      a.phone,
      a.email,
      a.doctor,
      a.department,
      a.date,
      a.time,
      a.reason,
      a.status,
      a.created_at,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading
        title="Appointments"
        description="Every request submitted from the website, newest first. Change the status as you confirm slots on call."
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </PageHeading>

      <div className="space-y-5">
        {storage === 'read-only' && <StorageNotice storage={storage} />}

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter appointments by status">
          {(['all', ...statuses] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors',
                filter === value
                  ? 'bg-brand-700 text-white'
                  : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300',
              )}
            >
              {value}
              <span className="ml-1.5 text-xs opacity-80">
                {value === 'all'
                  ? appointments.length
                  : appointments.filter((a) => a.status === value).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-2xl border border-brand-900/10 bg-white p-6 text-sm text-ink-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading appointments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-900/15 bg-white p-10 text-center text-sm text-ink-600">
            No {filter === 'all' ? '' : `${filter} `}appointment requests yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[64rem] text-left text-sm">
                <caption className="sr-only">Appointment requests</caption>
                <thead className="bg-brand-50/70 text-2xs font-bold uppercase tracking-[0.12em] text-ink-500">
                  <tr>
                    <th scope="col" className="px-4 py-3">Patient</th>
                    <th scope="col" className="px-4 py-3">Requested slot</th>
                    <th scope="col" className="px-4 py-3">Doctor / department</th>
                    <th scope="col" className="px-4 py-3">Reason</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-900/8">
                  {filtered.map((appointment) => (
                    <tr key={appointment.id} className="align-top hover:bg-brand-50/40">
                      <td className="px-4 py-4">
                        <p className="font-bold text-brand-950">{appointment.patient_name}</p>
                        <a href={`tel:+91${appointment.phone}`} className="text-xs text-royal-700 hover:underline">
                          {appointment.phone}
                        </a>
                        {appointment.email && (
                          <p className="text-xs text-ink-500">{appointment.email}</p>
                        )}
                        <p className="mt-1 text-2xs text-ink-400">{formatDateTime(appointment.created_at)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ink-800">{appointment.date}</p>
                        <p className="text-xs text-ink-600">{appointment.time}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-ink-800">{appointment.doctor || 'Any doctor'}</p>
                        <p className="text-xs text-ink-600">{appointment.department || '—'}</p>
                      </td>
                      <td className="max-w-[16rem] px-4 py-4 text-xs leading-relaxed text-ink-600">
                        {appointment.reason || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <label className="sr-only" htmlFor={`status-${appointment.id}`}>
                          Status for {appointment.patient_name}
                        </label>
                        <select
                          id={`status-${appointment.id}`}
                          value={appointment.status}
                          disabled={busyId === appointment.id}
                          onChange={(event) =>
                            updateStatus(appointment.id, event.target.value as AppointmentStatus)
                          }
                          className={cn(
                            'rounded-full px-3 py-1.5 text-2xs font-bold uppercase tracking-[0.1em] ring-1 focus:outline-none focus:ring-4 focus:ring-brand-500/25',
                            statusStyles[appointment.status],
                          )}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => remove(appointment.id)}
                          disabled={busyId === appointment.id}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-alert-soft hover:text-alert disabled:opacity-50"
                          aria-label={`Delete request from ${appointment.patient_name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
