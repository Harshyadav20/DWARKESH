-- ---------------------------------------------------------------------------
-- Dwarkesh Medical Centre LLP — Supabase / PostgreSQL schema
--
-- Run this once in the Supabase SQL editor (or with psql) to prepare the
-- database used by the appointment form and the admin panel.
--
-- The Next.js server connects with the SERVICE ROLE key, which bypasses RLS,
-- so no policies are required. Never expose that key to the browser.
--
-- Column names are quoted camelCase for doctors/services/gallery_items so the
-- rows map 1:1 onto the TypeScript types in src/lib/types.ts (the app casts
-- rows directly). `appointments` uses snake_case as specified in the brief.
-- ---------------------------------------------------------------------------

-- 1. Appointment requests -----------------------------------------------
create table if not exists appointments (
  id           text primary key,
  patient_name text        not null,
  phone        text        not null,
  email        text        not null default '',
  doctor       text        not null default '',
  department   text        not null default '',
  date         date        not null,
  time         text        not null,
  reason       text        not null default '',
  status       text        not null default 'pending'
               check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

create index if not exists appointments_created_at_idx on appointments (created_at desc);
create index if not exists appointments_status_idx     on appointments (status);

-- 2. Doctors -------------------------------------------------------------
create table if not exists doctors (
  id                 text primary key,
  slug               text    not null unique,
  name               text    not null,
  qualifications     text    not null default '',
  specialization     text    not null default '',
  department         text    not null default '',
  photo              text,
  "consultationTiming" text,
  bio                text,
  highlights         jsonb   not null default '[]'::jsonb,
  "order"            integer not null default 0,
  visible            boolean not null default true
);

-- 3. Services (medical / diagnostic / dental / home-visit) ----------------
create table if not exists services (
  id               text primary key,
  slug             text    not null,
  name             text    not null,
  "group"          text    not null
                   check ("group" in ('medical', 'diagnostic', 'dental', 'home-visit')),
  "shortDescription" text  not null default '',
  description      text,
  icon             text    not null default 'Stethoscope',
  image            text,
  points           jsonb   not null default '[]'::jsonb,
  "ctaLabel"       text,
  department       text    not null default '',
  "order"          integer not null default 0,
  visible          boolean not null default true,
  "sameDayResults" boolean not null default false,
  unique (slug, "group")
);

-- 4. Gallery --------------------------------------------------------------
create table if not exists gallery_items (
  id       text primary key,
  src      text    not null,
  alt      text    not null,
  category text    not null
           check (category in
             ('Clinic', 'Doctors', 'Diagnostic Services', 'Dental', 'Medical Equipment', 'Healthcare')),
  caption  text,
  "order"  integer not null default 0,
  visible  boolean not null default true
);

-- 5. Settings (single row, id = 1) ----------------------------------------
create table if not exists site_settings (
  id       integer primary key default 1,
  settings jsonb not null default '{}'::jsonb,
  constraint single_row check (id = 1)
);

-- ---------------------------------------------------------------------------
-- Empty tables are fine: whenever a table has no rows the website falls back
-- to the bundled defaults in src/lib/data/*, so the site never breaks while
-- content is being prepared.
-- ---------------------------------------------------------------------------
