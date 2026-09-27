import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/auth';
import { saveDoctors, saveGallery, saveServices, storageMode } from '@/lib/store';
import { doctorSchema, galleryItemSchema } from '@/lib/validation';
import { iconNames } from '@/lib/icons';
import type { ServiceItem } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Single endpoint for saving whole collections (doctors / services / gallery).
 * The admin UI always sends the complete list, which keeps the write model
 * simple and race-free for a small clinic team.
 */

const serviceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().trim().min(1).max(160),
  group: z.enum(['medical', 'diagnostic', 'dental', 'home-visit']),
  shortDescription: z.string().trim().min(1).max(400),
  description: z.string().trim().max(2000).optional(),
  icon: z.enum(iconNames as [string, ...string[]]),
  image: z.string().trim().max(500).nullable().optional(),
  points: z.array(z.string().trim().max(200)).max(12).optional(),
  ctaLabel: z.string().trim().max(60).optional(),
  department: z.string().trim().max(120),
  order: z.number().int().min(0).max(999),
  visible: z.boolean(),
  sameDayResults: z.boolean().optional(),
});

const payloadSchema = z.object({
  collection: z.enum(['doctors', 'services', 'gallery']),
  items: z.array(z.unknown()).min(1),
});

export async function PUT(request: Request) {
  if (!(await getCurrentSession())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 422 });
  }

  const { collection, items } = parsed.data;

  if (collection === 'doctors') {
    const schema = z.array(doctorSchema);
    const result = schema.safeParse(items);
    if (!result.success) {
      return NextResponse.json({ ok: false, issues: result.error.issues }, { status: 422 });
    }
    const ok = await saveDoctors(result.data);
    return NextResponse.json({ ok, storage: storageMode() });
  }

  if (collection === 'gallery') {
    const schema = z.array(galleryItemSchema);
    const result = schema.safeParse(items);
    if (!result.success) {
      return NextResponse.json({ ok: false, issues: result.error.issues }, { status: 422 });
    }
    const ok = await saveGallery(result.data);
    return NextResponse.json({ ok, storage: storageMode() });
  }

  const schema = z.array(serviceSchema);
  const result = schema.safeParse(items);
  if (!result.success) {
    return NextResponse.json({ ok: false, issues: result.error.issues }, { status: 422 });
  }
  const ok = await saveServices(result.data as ServiceItem[]);
  return NextResponse.json({ ok, storage: storageMode() });
}
