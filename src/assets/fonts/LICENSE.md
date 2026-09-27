# Font attribution

All fonts are **self-hosted** by the website:

- `src/assets/fonts/*Variable*.woff2` — loaded through `next/font/local` in
  `src/app/layout.tsx` (no third-party request at page load).
- `public/fonts/Inter-*.woff`, `public/fonts/NotoSansDevanagari-Bold.woff` —
  used only by the server-side Open Graph image generator
  (`src/app/api/og/route.tsx`).

| File | Family | License |
| ---- | ------ | ------- |
| `InterVariable-latin.woff2`, `Inter-SemiBold.woff`, `Inter-ExtraBold.woff` | Inter | SIL Open Font License 1.1 — © Rasmus Andersson, https://rsms.me/inter/ |
| `ManropeVariable-latin.woff2` | Manrope | SIL Open Font License 1.1 — © Mikhail Sharanda, https://manropefont.com/ |
| `NotoSansDevanagariVariable.woff2`, `NotoSansDevanagariVariable-latin.woff2`, `NotoSansDevanagari-Bold.woff` | Noto Sans Devanagari | SIL Open Font License 1.1 — © Google, https://fonts.google.com/noto |

Full license text: https://scripts.sil.org/OFL
