import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { saveSettings } from '@/lib/store';
import { settingsSchema } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Some settings are invalid.',
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const saved = await saveSettings(parsed.data);
  return NextResponse.json({ ok: true, settings: saved, storage: 'saved' });
}
