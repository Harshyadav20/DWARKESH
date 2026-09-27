import Link from 'next/link';
import { CalendarClock, CheckCircle2, Clock, Image as ImageIcon, Stethoscope, Wrench, XCircle } from 'lucide-react';
import { PageHeading, StorageNotice } from '@/components/admin/ui';
import { buttonStyles } from '@/components/ui/button';
import { getContent, listAppointments, storageMode } from '@/lib/store';
import { formatDateTime } from '@/lib/utils';
import type { AppointmentStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const statusStyles: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  confirmed: 'bg-leaf-50 text-leaf-800 ring-leaf-200',
  completed: 'bg-brand-50 text-brand-800 ring-brand-200',
  cancelled: 'bg-ink-50 text-ink-600 ring-ink-200',
};

export default async function AdminDashboard() {
  const [content, appointments] = await Promise.all([getContent(), listAppointments()]);
  const storage = storageMode();

  const counts = {
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  const stats = [
    { label: 'Pending requests', value: counts.pending, icon: Clock, tone: 'text-amber-700 bg-amber-50' },
    { label: 'Confirmed', value: counts.confirmed, icon: CheckCircle2, tone: 'text-leaf-700 bg-leaf-50' },
    { label: 'Completed', value: counts.completed, icon: CalendarClock, tone: 'text-brand-700 bg-brand-50' },
    { label: 'Cancelled', value: counts.cancelled, icon: XCircle, tone: 'text-ink-600 bg-ink-50' },
  ];

  const quickLinks = [
    { href: '/admin/appointments', label: 'Appointments', icon: CalendarClock, count: appointments.length },
    { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope, count: content.doctors.length },
    { href: '/admin/services', label: 'Services', icon: Wrench, count: content.services.length },
    { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, count: content.gallery.length },
  ];

  return (
    <>
      <PageHeading
        title="Dashboard"
        description={`Everything the public site shows comes from here. Storage: ${storage}.`}
      />

      <div className="space-y-6">
        {storage !== 'supabase' && <StorageNotice storage={storage} />}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-brand-900/10 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">{stat.label}</p>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.tone}`}>
                  <stat.icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold text-brand-950">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-2xl border border-brand-900/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <link.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-bold text-brand-950">{link.label}</span>
              </span>
              <span className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-bold text-ink-600">
                {link.count}
              </span>
            </Link>
          ))}
        </div>

        <section className="rounded-2xl border border-brand-900/10 bg-white shadow-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 px-5 py-4">
            <h2 className="font-display text-base font-bold text-brand-950">Latest appointment requests</h2>
            <Link href="/admin/appointments" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
              Manage all
            </Link>
          </header>

          {appointments.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-600">
              No appointment requests yet. Requests submitted through the website form appear here
              instantly, and the clinic is notified by email when Resend is configured.
            </p>
          ) : (
            <ul className="divide-y divide-brand-900/8">
              {appointments.slice(0, 6).map((appointment) => (
                <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="text-sm font-bold text-brand-950">{appointment.patient_name}</p>
                    <p className="mt-0.5 text-xs text-ink-600">
                      {appointment.department || 'General'} · {appointment.date} at {appointment.time} ·{' '}
                      {appointment.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.1em] ring-1 ${statusStyles[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                    <span className="text-xs text-ink-500">{formatDateTime(appointment.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
