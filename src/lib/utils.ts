import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip a string down to a URL-safe slug. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Format an ISO date for human display (e.g. "12 Mar 2026, 10:30 AM"). */
export function formatDateTime(iso: string | Date, timeZone = 'Asia/Kolkata') {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(date);
}

/** Format an ISO date (e.g. "12 Mar 2026"). */
export function formatDate(iso: string | Date, timeZone = 'Asia/Kolkata') {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone }).format(date);
}

/** Group digits of an Indian mobile number for readability: 86559 19879. */
export function formatIndianPhone(digits: string) {
  const clean = digits.replace(/\D/g, '');
  if (clean.length === 10) return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  if (clean.length === 12 && clean.startsWith('91')) return `+91 ${clean.slice(2, 7)} ${clean.slice(7)}`;
  return digits;
}

/** Initials for avatar placeholders, e.g. "Dr. Rita Yadav" → "RY". */
export function initials(name: string) {
  const parts = name
    .replace(/^(dr\.?|doctor)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0] as string).slice(0, 2).toUpperCase();
  return `${(parts[0] as string)[0]}${(parts[parts.length - 1] as string)[0]}`.toUpperCase();
}

/** Simple absolute URL helper used for canonical/OG/schema URLs. */
export function absoluteUrl(path: string, baseUrl: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = baseUrl.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** Escape a string for safe use inside a JSON-LD <script> block. */
export function escapeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** Today's date as yyyy-mm-dd in IST — used for min="" on date inputs. */
export function todayInIst() {
  const now = new Date();
  const ist = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

/** Parse "8:00 AM – 10:00 PM" into schema.org 24h times. */
export function parseHours(value: string): { opens: string; closes: string } | null {
  const match = value.match(
    /(\d{1,2})[:.](\d{2})?\s*(am|pm)?\s*[–—-]\s*(\d{1,2})[:.](\d{2})?\s*(am|pm)?/i,
  );
  if (!match) return null;

  const to24 = (h: string, m: string | undefined, meridiem: string | undefined) => {
    let hour = Number(h);
    const minute = Number(m ?? '0');
    const lower = (meridiem ?? '').toLowerCase();
    if (lower === 'pm' && hour < 12) hour += 12;
    if (lower === 'am' && hour === 12) hour = 0;
    return { hour, minute };
  };

  const open = to24(match[1] as string, match[2], match[3]);
  const close = to24(match[4] as string, match[5], match[6]);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { opens: `${pad(open.hour)}:${pad(open.minute)}`, closes: `${pad(close.hour)}:${pad(close.minute)}` };
}

/** Build selectable appointment slots from a human-readable hours string. */
export function buildTimeSlots(hours: string, stepMinutes = 30): string[] {
  const parsed = parseHours(hours);
  const start = parsed ? parsed.opens : '09:00';
  const end = parsed ? parsed.closes : '21:00';

  const toMinutes = (value: string) => {
    const [h, m] = value.split(':').map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };

  let cursor = toMinutes(start);
  const last = toMinutes(end) - stepMinutes;
  const slots: string[] = [];

  while (cursor <= last && slots.length < 48) {
    const hour24 = Math.floor(cursor / 60);
    const minute = cursor % 60;
    const meridiem = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    slots.push(`${hour12}:${String(minute).padStart(2, '0')} ${meridiem}`);
    cursor += stepMinutes;
  }

  return slots;
}

