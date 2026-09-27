import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/auth';
import { deleteAppointment, listAppointments, updateAppointmentStatus } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const statusSchema = z.enum(['pending', 'confirmed', 'completed', 'cancelled']);

export async function GET() {
  if (!(await getCurrentSession())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const appointments = await listAppointments();
  return NextResponse.json({ ok: true, appointments });
}

export async function PATCH(request: Request) {
  if (!(await getCurrentSession())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = z.object({ id: z.string().min(1), status: statusSchema }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 422 });
  }

  const ok = await updateAppointmentStatus(parsed.data.id, parsed.data.status);
  return NextResponse.json({ ok });
}

export async function DELETE(request: Request) {
  if (!(await getCurrentSession())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ ok: false, error: 'Missing id.' }, { status: 422 });
  }

  const ok = await deleteAppointment(id);
  return NextResponse.json({ ok });
}
