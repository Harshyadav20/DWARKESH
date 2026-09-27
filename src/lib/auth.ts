import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'dmc_admin_session';

/**
 * Admin authentication.
 *
 * A tiny, dependency-free session: the cookie stores `expiry.signature`, where
 * the signature is an HMAC-SHA256 over the expiry using AUTH_SECRET (falling
 * back to ADMIN_PASSWORD). Comparison is constant time.
 */

function getSecret(): string | null {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || null;
}

/** The admin area is only usable once a password has been configured. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function sessionHours(): number {
  const raw = Number(process.env.ADMIN_SESSION_HOURS);
  return Number.isFinite(raw) && raw > 0 && raw <= 168 ? raw : 8;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = Date.now() + sessionHours() * 60 * 60 * 1000;
  const payload = `dmc.admin.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 4) return false;
  const [a, b, expiryRaw, signature] = parts as [string, string, string, string];
  if (a !== 'dmc' || b !== 'admin') return false;

  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expected = sign(`${a}.${b}.${expiryRaw}`, secret);
  const provided = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (provided.length !== want.length) return false;
  return timingSafeEqual(provided, want);
}

/** Constant-time check of the submitted admin password. */
export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function getCurrentSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function startSession(): Promise<boolean> {
  const token = createSessionToken();
  if (!token) return false;
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionHours() * 60 * 60,
  });
  return true;
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
