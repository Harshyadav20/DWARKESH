import { NextResponse } from 'next/server';
import { getCurrentSession, isAdminConfigured, startSession, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'The admin panel is not configured yet. Set ADMIN_PASSWORD (and ideally AUTH_SECRET) in your environment variables, then restart the server.',
      },
      { status: 503 },
    );
  }

  if (await getCurrentSession()) {
    return NextResponse.json({ ok: true, already: true });
  }

  let password: unknown;
  try {
    const body = (await request.json()) as { password?: unknown };
    password = body.password;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof password !== 'string' || !verifyPassword(password)) {
    // Constant-time response shape: never hint whether the user exists.
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });
  }

  const started = await startSession();
  if (!started) {
    return NextResponse.json({ ok: false, error: 'Could not start a session.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
