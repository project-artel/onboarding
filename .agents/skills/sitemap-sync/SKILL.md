---
name: sitemap-sync
description: Keep public/sitemap.xml and public/llms.txt in step with the routes in src/App.tsx. Use whenever a page route is added, removed, renamed, or given a new locale, when the site origin changes, or when asked to update the sitemap, robots.txt, llms.txt, or SEO metadata.
---

# Sitemap Sync

Follow `.agents/docs/seo.md`. It names the files and the rules; this skill is the
procedure.

## Procedure

1. Read the routes in `localeRoutes()` in `src/App.tsx`. Each one exists under `/`
   (Korean) and `/en` (English). Use `pathWithLocale` in `src/i18n/locale.ts` for
   the exact URL form: `/en` for the English home, `/en/<path>` otherwise.
2. Open `public/sitemap.xml`. For each route add or remove two `<url>` entries, one
   per locale. Each entry carries three `xhtml:link` alternates: `ko`, `en`, and
   `x-default` pointing at the Korean URL. Remove entries whose route no longer
   exists.
3. Open `public/llms.txt`. Add or remove the route in the English `## Pages` list
   (with a one-line description) and in the `## 한국어` list.
4. If the route changes how the site is described, check the site-wide values in
   `index.html` and the `meta` copy in `src/i18n/messages.ts`.
5. Leave `public/robots.txt` alone unless the user asked to block something.
6. Run the comparison commands in `.agents/docs/seo.md` and fix any mismatch.

## Done When

- Every route in `src/App.tsx` has two sitemap entries and a line in both lists of
  `llms.txt`.
- No sitemap or `llms.txt` URL lacks a route.
- The sitemap and `llms.txt` changes are in the same commit as the route change.
