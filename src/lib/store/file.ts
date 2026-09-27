import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import type { Appointment, Doctor, GalleryItem, ServiceItem, SiteSettings } from '../types';

/**
 * JSON file store — used when Supabase is not configured.
 *
 * Great for local development. On read-only serverless file systems (Vercel)
 * writes fail gracefully and `isFileStoreWritable()` reports false, which the
 * admin panel surfaces as a banner telling you to connect Supabase.
 */

export type FileDb = {
  settings: SiteSettings | null;
  doctors: Doctor[] | null;
  services: ServiceItem[] | null;
  gallery: GalleryItem[] | null;
  appointments: Appointment[] | null;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const emptyDb: FileDb = {
  settings: null,
  doctors: null,
  services: null,
  gallery: null,
  appointments: null,
};

let cached: FileDb | null = null;
let writeOk = true;

export async function readDb(): Promise<FileDb> {
  if (cached) return cached;
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<FileDb>;
    cached = { ...emptyDb, ...parsed };
    return cached;
  } catch {
    cached = emptyDb;
    return cached;
  }
}

export async function writeDb(db: FileDb): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    cached = db;
    writeOk = true;
    return true;
  } catch {
    writeOk = false;
    return false;
  }
}

export function isFileStoreWritable(): boolean {
  return writeOk;
}

export async function patchDb(patch: Partial<FileDb>): Promise<FileDb> {
  const db = await readDb();
  const next = { ...db, ...patch };
  await writeDb(next);
  return next;
}

/** Test helper — clears the in-memory cache so the file is re-read. */
export function resetFileDbCache() {
  cached = null;
}
