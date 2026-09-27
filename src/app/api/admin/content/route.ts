import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { getContent, storageMode } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Read the full editable content set for the admin dashboard. */
export async function GET() {
  if (!(await getCurrentSession())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getContent();

  return NextResponse.json({
    ok: true,
    storage: storageMode(),
    settings: content.settings,
    doctors: content.doctors,
    services: content.services,
    gallery: content.gallery,
  });
}
