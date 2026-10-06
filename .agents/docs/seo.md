# Search and AI Discoverability

## Why

The public site is meant to be found by search engines and AI crawlers. Three
static files and the `<head>` of `index.html` tell them what exists. When a
route changes and those files do not, crawlers learn a page that is gone or never
learn a page that was added.

## Files That Must Match the Routes

The route list lives in `localeRoutes()` in `src/App.tsx`, mounted once at `/`
(Korean) and once at `/en` (English). Every route there must appear in all of
these:

| File | What it holds for each route |
|---|---|
| `public/sitemap.xml` | One `<url>` per locale, each with `hreflang` alternates for `ko`, `en`, and `x-default` (the Korean URL) |
| `public/llms.txt` | One link in the English `## Pages` list and one in the `## 한국어` list, each with a short description |
| `index.html` | Only site-wide values: `canonical`, `hreflang`, `og:*`, `twitter:*`, JSON-LD. Per-route values are written at runtime by `src/components/SiteLayout.tsx` |

`public/robots.txt` allows every crawler on purpose. Do not add a `Disallow`
unless the user asks for one. It points at `/sitemap.xml`, so keep that file name.

The origin is `https://artel.kr`. It is written in `index.html`, `public/sitemap.xml`,
`public/llms.txt`, and `siteOrigin` in `src/components/SiteLayout.tsx`. Change all
four together.

## When to Update

Update the files above in the same change whenever a route is added, removed, or
renamed, a locale is added, or the origin changes. Do not defer it to a follow-up.

## Check Before Handing Off

List the routes and the sitemap entries and compare them:

```bash
grep -o 'path="[^"]*"' src/App.tsx
grep -o '<loc>[^<]*</loc>' public/sitemap.xml
grep -o 'https://artel.kr[^)]*' public/llms.txt
```

Every route appears once per locale in the sitemap, and every sitemap URL appears
in `llms.txt`. A URL that has no route is a 404 for crawlers.
