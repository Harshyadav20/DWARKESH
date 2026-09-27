# Dwarkesh Medical Centre LLP — Official Website

A production-ready, SEO-first healthcare website for **Dwarkesh Medical Centre LLP**
(द्वारकेश मेडिकल सेंटर एल एल पी) — Shop No. 4, Swapnikiran Building, Pimparipada,
Malad East, Mumbai – 400097, Maharashtra, India.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**, a small admin
content studio, an appointment pipeline (Supabase or a zero-config file store),
full local SEO (schema.org, sitemap, robots, Open Graph) and WCAG-friendly markup.

---

## 1. Quick start

```bash
npm install
cp .env.example .env.local      # then fill in what you need (everything is optional)
npm run dev                     # http://localhost:3000
```

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Dev server on `0.0.0.0:3000` (preview-friendly) |
| `npm run build` | Production build + type check + lint |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |

---

## 2. Pages

| Route | Purpose |
| ----- | ------- |
| `/` | Home — hero → quick CTA → services → about → why us → doctors → diagnostics → dental → home visit → highlights/FAQ → gallery → appointment form → contact + map → emergency |
| `/about` | About the centre, facilities, team overview |
| `/doctors`, `/doctors/[slug]` | Doctor directory + profile pages |
| `/services`, `/services/[slug]` | Medical services |
| `/diagnostics`, `/diagnostics/[slug]` | Advanced diagnostics (Digital X-Ray, 2D Echo, Mammography, ECG, Blood Test, Pathology, Sonography) |
| `/dental` | Dwarkesh Dental Clinic |
| `/home-visit` | Home visit service |
| `/gallery` | Filterable gallery with lightbox |
| `/contact` | Contact actions, address, Google Map, message composer, FAQ |
| `/book-appointment` | Appointment request form |
| `/faq` | FAQ (also embedded on home/contact) |
| `/admin/*` | Content studio (login, dashboard, appointments, doctors, services, gallery, settings) |

Supporting routes: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`,
`/icon.svg`, `/api/og` (Open Graph image generator), `/api/appointments`,
`/api/admin/*`.

---

## 3. Content rules (important)

The website only publishes information supplied by the clinic:

- **No invented claims** — no “No.1”, “best”, awards, cure guarantees.
- **No invented doctor data** — qualifications and timings come from the clinic;
  missing values render as *“Details to be updated”*.
- **No stock/fake doctor portraits** — until the clinic supplies photographs
  (with each doctor’s consent), a branded monogram placeholder is shown.
- **Same-day-results badge** is configurable (`Admin → Settings`) and hidden
  when switched off.
- The emergency bar text (*24 × 7 Emergency Assistance*) is configurable and
  should only be kept while the clinic actually offers it.

### Placeholder assets to replace when the clinic supplies real material

| Asset | Location | Replace with |
| ----- | -------- | ------------ |
| Clinic / service photography | `public/images/*.jpg` | Real photographs of the centre, equipment and staff |
| Open Graph card | `public/images/og-cover.png` (auto-generated from `/api/og`) | Optional |
| Logo | Inline SVG in `src/components/brand/logo.tsx` + `public/logo.svg` | The clinic's official logo artwork |
| Doctor photos | `Admin → Doctors → Photo path` | Real portraits (consent required) |

---

## 4. Admin content studio

1. Set the environment variables (see §5) — at minimum `ADMIN_PASSWORD`.
2. Open `/admin` and sign in.
3. Manage:
   - **Appointments** — status workflow (pending / confirmed / completed /
     cancelled), delete, CSV export.
   - **Doctors** — names, qualifications, specialisations, timings, photos,
     visibility.
   - **Services** — all four groups, icons, images, bullet points, CTAs.
   - **Gallery** — image paths, categories, captions, alt text, visibility.
   - **Settings** — emergency strip & number, clinic/home-visit hours, hero
     headline, diagnostic tagline, same-day-results toggle, WhatsApp/floating
     buttons, socials, map embed URL and coordinates.

Sessions are HMAC-signed cookies (`httpOnly`), expiry defaults to 8 hours
(`ADMIN_SESSION_HOURS`). The real check happens in the Node runtime
(`src/lib/auth.ts`); the Edge middleware only redirects.

### Where edits are stored

| Backend | When | Notes |
| ------- | ---- | ----- |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` set | Run `supabase/schema.sql` once. Recommended for production. |
| **File store** | No Supabase configured and a writable disk | Writes `data/db.json` (gitignored). Great for local development. |
| **Read-only** | Serverless without Supabase | Admin shows a banner; edits are not persisted. |

Pages cache content for 5 minutes (`unstable_cache` + `revalidateTag`), so
edits appear on the public site within moments.

---

## 5. Environment variables

All optional — the site runs with sensible defaults. See `.env.example`.

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for SEO/sitemap/OG (no trailing slash) |
| `ADMIN_PASSWORD` | Enables `/admin` |
| `AUTH_SECRET` | Signs the admin session cookie (falls back to `ADMIN_PASSWORD`) |
| `ADMIN_SESSION_HOURS` | Session lifetime (default 8) |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database |
| `RESEND_API_KEY`, `APPOINTMENT_NOTIFY_EMAIL`, `EMAIL_FROM` | E-mail notification for new appointment requests |
| `NEXT_PUBLIC_MAPS_EMBED_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Official Google Maps embed (falls back to a key-less embed + directions link) |
| `NEXT_PUBLIC_CLINIC_LAT`, `NEXT_PUBLIC_CLINIC_LNG` | Only if the clinic supplied coordinates — never guessed |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 |

No API key is ever shipped to the browser except the explicitly `NEXT_PUBLIC_`
ones, which are safe by design.

---

## 6. Deployment (Vercel)

1. Push this repository and import it in Vercel (framework: Next.js).
2. Add the environment variables you need (at least `NEXT_PUBLIC_SITE_URL`,
   `ADMIN_PASSWORD`, `AUTH_SECRET`, and the Supabase pair for persistence).
3. Deploy. Static pages are ISR-cached for 5 minutes; the API routes are
   serverless.

Because fonts are self-hosted and images are optimised at build time (AVIF/WebP
via `next/image`), the site has no third-party render-blocking requests.

---

## 7. SEO & structured data

- Per-page `title`, `description`, canonical, Open Graph + Twitter cards.
- `schema.org`: `MedicalClinic` + `LocalBusiness` (with address, telephone,
  email, opening hours parsed from admin timings, `areaServed`, contact points,
  and `geo` **only when configured**), `Physician` on doctor pages,
  `MedicalTest`/`MedicalProcedure` lists, `FAQPage`, `BreadcrumbList`, `WebSite`.
- `sitemap.xml` generated from the same content source the pages render from.
- `robots.txt` blocks `/admin` and `/api/`.
- Open Graph image generated server-side at `/api/og` (branded card with the
  Hindi name), also cached as `public/images/og-cover.png`.

Local SEO targets (used naturally, never stuffed): medical centre / diagnostic
centre / pathology lab / digital X-ray / sonography / ECG / dental clinic /
blood test / home visit doctor / doctor consultation **in Malad East, Mumbai**.

---

## 8. Accessibility & performance

- Skip link, landmark regions, logical heading order, visible focus rings.
- All interactive elements ≥ 44 px touch targets; mobile action bar with three
  persistent actions (WhatsApp / Call / Book).
- Forms: real `<label>`s, `aria-invalid`, `role="alert"` errors, keyboard-safe
  lightbox and accordions (`aria-expanded`, `aria-controls`, Escape/arrow keys).
- `prefers-reduced-motion` respected everywhere.
- Self-hosted variable fonts (Inter, Manrope, Noto Sans Devanagari) — OFL
  licensed, see `src/assets/fonts/LICENSE.md`.
- Images: `next/image` with AVIF/WebP, responsive `sizes`, lazy loading
  (hero uses `priority`).
- Minimal client JS: most pages ship ~2–3 kB of page-specific JavaScript.

---

## 9. Security

- Server-side validation (Zod) mirroring the client schema.
- Appointment endpoint: honeypot field, minimum completion time, per-IP rate
  limit (6 / 10 min), text sanitisation, no secrets in responses.
- Admin: HMAC-signed `httpOnly` cookies, constant-time comparisons, login
  endpoint outside the middleware gate but rate-limited by design.
- Security headers (nosniff, frame options, referrer policy, permissions
  policy) in `next.config.mjs`.
- `data/db.json` (local store) is gitignored; `.env*` never commits.

---

## 10. Project structure

```
src/
├── app/
│   ├── (site)/            # public pages + marketing layout
│   ├── admin/             # content studio
│   ├── api/               # appointments, admin, og
│   ├── layout.tsx         # root: fonts, global metadata
│   ├── sitemap.ts robots.ts manifest.ts icon.svg
├── components/
│   ├── layout/            # header, emergency bar, footer, floating actions
│   ├── home/              # homepage sections
│   ├── cards/             # service / doctor / diagnostic cards
│   ├── appointment/       # form + section
│   ├── contact/           # actions, map, message composer
│   ├── gallery/           # lightbox gallery
│   ├── admin/             # studio shell + UI kit
│   └── ui/ brand/ seo/ faq/ diagnostics/ services/ emergency/
├── lib/
│   ├── data/              # clinic-supplied defaults (doctors, services, …)
│   ├── store/             # supabase + file backends, caching
│   ├── auth.ts links.ts seo.ts types.ts utils.ts validation.ts icons.ts
└── middleware.ts          # admin gate (Edge)
supabase/schema.sql
public/images public/fonts
```

---

## 11. Contact details baked into the site

- Phone / WhatsApp: **86559 19879** (`+91 86559 19879`, wa.me/918655919879)
- Email: **dwarkeshmedicalcentre06@gmail.com**
- Address: Shop No. 4, Swapnikiran Building, Pimparipada, Malad East,
  Mumbai – 400097, Maharashtra, India

© 2026 Dwarkesh Medical Centre LLP. All Rights Reserved.
