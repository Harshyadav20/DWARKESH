import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import type {
  Appointment,
  AppointmentStatus,
  Doctor,
  GalleryItem,
  ServiceItem,
  SiteContent,
  SiteSettings,
} from '../types';
import { defaultSettings } from '../data/settings';
import { defaultDoctors } from '../data/doctors';
import {
  dentalServices,
  diagnosticServices,
  homeVisitServices,
  medicalServices,
} from '../data/services';
import { defaultGallery } from '../data/gallery';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { isFileStoreWritable, patchDb, readDb } from './file';

export const CONTENT_TAG = 'site-content';
export const APPOINTMENTS_TAG = 'appointments';

export const allDefaultServices: ServiceItem[] = [
  ...medicalServices,
  ...diagnosticServices,
  ...dentalServices,
  ...homeVisitServices,
];

/** Where content edits can actually be persisted (Supabase or writable FS). */
export function storageMode(): 'supabase' | 'file' | 'read-only' {
  if (isSupabaseConfigured()) return 'supabase';
  if (isFileStoreWritable()) return 'file';
  return 'read-only';
}

/* ------------------------------------------------------------------ */
/* Uncached readers                                                    */
/* ------------------------------------------------------------------ */

async function readSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data?.settings) {
      return { ...defaultSettings, ...(data.settings as Partial<SiteSettings>) };
    }
    return defaultSettings;
  }
  const db = await readDb();
  return db.settings ? { ...defaultSettings, ...db.settings } : defaultSettings;
}

async function readDoctors(): Promise<Doctor[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('doctors').select('*').order('order', { ascending: true });
    if (data && data.length > 0) return data as unknown as Doctor[];
    return defaultDoctors;
  }
  const db = await readDb();
  return db.doctors ?? defaultDoctors;
}

async function readServices(): Promise<ServiceItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('services').select('*').order('order', { ascending: true });
    if (data && data.length > 0) return data as unknown as ServiceItem[];
    return allDefaultServices;
  }
  const db = await readDb();
  return db.services ?? allDefaultServices;
}

async function readGallery(): Promise<GalleryItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('order', { ascending: true });
    if (data && data.length > 0) return data as unknown as GalleryItem[];
    return defaultGallery;
  }
  const db = await readDb();
  return db.gallery ?? defaultGallery;
}

/* ------------------------------------------------------------------ */
/* Cached reader used by pages                                         */
/* ------------------------------------------------------------------ */

async function readContent(): Promise<SiteContent> {
  const [settings, doctors, services, gallery] = await Promise.all([
    readSettings(),
    readDoctors(),
    readServices(),
    readGallery(),
  ]);
  return { settings, doctors, services, gallery };
}

export const getContent = unstable_cache(readContent, ['site-content'], {
  revalidate: 300,
  tags: [CONTENT_TAG],
});

/** Call after any admin mutation so pages pick changes up immediately. */
export async function refreshContent() {
  revalidateTag(CONTENT_TAG);
  revalidateTag(APPOINTMENTS_TAG);
}

/* ------------------------------------------------------------------ */
/* Writers                                                             */
/* ------------------------------------------------------------------ */

export async function saveSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await readSettings();
  const next: SiteSettings = { ...current, ...patch, updatedAt: new Date().toISOString() };

  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('site_settings').upsert({ id: 1, settings: next });
  } else {
    await patchDb({ settings: next });
  }
  await refreshContent();
  return next;
}

export async function saveDoctors(doctors: Doctor[]): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('doctors').delete().neq('id', '');
    const { error } = await supabase.from('doctors').insert(doctors);
    if (error) return false;
  } else {
    const ok = await patchDb({ doctors });
    if (!ok) return false;
  }
  await refreshContent();
  return true;
}

export async function saveServices(services: ServiceItem[]): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('services').delete().neq('id', '');
    const { error } = await supabase.from('services').insert(services);
    if (error) return false;
  } else {
    const ok = await patchDb({ services });
    if (!ok) return false;
  }
  await refreshContent();
  return true;
}

export async function saveGallery(gallery: GalleryItem[]): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('gallery_items').delete().neq('id', '');
    const { error } = await supabase.from('gallery_items').insert(gallery);
    if (error) return false;
  } else {
    const ok = await patchDb({ gallery });
    if (!ok) return false;
  }
  await refreshContent();
  return true;
}

/* ------------------------------------------------------------------ */
/* Appointments                                                        */
/* ------------------------------------------------------------------ */

export async function listAppointments(): Promise<Appointment[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    return (data ?? []) as unknown as Appointment[];
  }
  const db = await readDb();
  return [...(db.appointments ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function createAppointment(
  input: Omit<Appointment, 'id' | 'status' | 'created_at'>,
): Promise<Appointment | null> {
  const record: Appointment = {
    ...input,
    id: `apt_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    status: 'pending' as AppointmentStatus,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('appointments').insert(record);
    if (error) return null;
  } else {
    const db = await readDb();
    const ok = await patchDb({ appointments: [record, ...(db.appointments ?? [])].slice(0, 1000) });
    // A read-only file system is not fatal: the visitor still gets the
    // WhatsApp/phone confirmation path, and the clinic is notified by email
    // when Resend is configured.
    if (!ok) return record;
  }
  revalidateTag(APPOINTMENTS_TAG);
  return record;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) return false;
  } else {
    const db = await readDb();
    const next = (db.appointments ?? []).map((a) => (a.id === id ? { ...a, status } : a));
    const ok = await patchDb({ appointments: next });
    if (!ok) return false;
  }
  revalidateTag(APPOINTMENTS_TAG);
  return true;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) return false;
  } else {
    const db = await readDb();
    const ok = await patchDb({ appointments: (db.appointments ?? []).filter((a) => a.id !== id) });
    if (!ok) return false;
  }
  revalidateTag(APPOINTMENTS_TAG);
  return true;
}

/* ------------------------------------------------------------------ */
/* Convenience selectors                                               */
/* ------------------------------------------------------------------ */

export function visibleDoctors(doctors: Doctor[]) {
  return doctors.filter((d) => d.visible !== false).sort((a, b) => a.order - b.order);
}

export function servicesByGroup(services: ServiceItem[], group: ServiceItem['group']) {
  return services
    .filter((s) => s.group === group && s.visible !== false)
    .sort((a, b) => a.order - b.order);
}

export function findService(services: ServiceItem[], slug: string) {
  return services.find((s) => s.slug === slug && s.visible !== false) ?? null;
}

export function visibleGallery(gallery: GalleryItem[]) {
  return gallery.filter((g) => g.visible !== false).sort((a, b) => a.order - b.order);
}
