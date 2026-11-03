# Onboarding design rules

## Scope and precedence

Apply these rules to every page in onboarding, including marketing pages,
installation guides, and language reference documentation. These local rules
choose the site's visual design. Replay Studio's graphite palette, cyan accent,
application shell, and dark-first direction do not apply to this site.

## Existing design sources

Before designing or changing a page, inspect these files and a neighboring page:

- `src/styles/tokens.css`: colors, fonts, spacing, radii, and light/dark tokens.
- `src/styles/marketing.css`: shared site layout and component styling.
- `src/styles/site-chrome.css`: floating header, footer, logo, and header-edge
  progress route. Loaded after `marketing.css` and `responsive.css`.
- `src/styles/pages.css`: install-page and documentation restyle.
- `src/components/SiteLayout.tsx`: header, navigation, footer, and theme control.
- `src/components/HeaderRoute.tsx`, `src/components/PageChrome.tsx`: header-edge
  progress, header height, and documentation table-of-contents state.
- `src/pages/landing/`: landing map, scenes, feature dialog, and `landing.css`.
- `src/theme.ts`: theme selection and persistence.
- `src/components/CodeBlock.tsx`: code examples and copy behavior.

Reuse these sources instead of introducing a separate page-level design system.

## Colors and typography

Use the existing cream-paper surfaces, ink text, and vermilion accent in light
mode, and their existing dark-mode equivalents. Reference the tokens rather than
copying their current color values:

| Purpose | Tokens |
| --- | --- |
| Page and secondary surfaces | `--paper`, `--paper-2` |
| Text | `--ink`, `--ink-2`, `--ink-3` |
| Dividers and grid | `--rule`, `--grid` |
| Accent and foreground on accent | `--flare`, `--on-flare` |
| Display, body, and code | `--font-display`, `--font-body`, `--font-mono` |
| Plate shadow under framed panels | `--plate-shadow` |
| Layout and radii | Existing layout and radius tokens in `tokens.css` |

Fonts: `--font-display` is Unbounded for Latin text and falls back to Wanted
Sans Variable for Hangul; `--font-body` is Wanted Sans Variable; `--font-mono`
is IBM Plex Mono. `index.html` loads all three. Hangul set in display headings
uses a heavier Wanted Sans weight so the two scripts read at the same weight.

Do not add hard-coded page palettes or alternate font stacks. Page-specific
variables may alias shared tokens when needed; they must not duplicate colors.
The landing scene illustrations keep three evidence colors (`--ev-reason`,
`--ev-success`, `--ev-warn` in `landing.css`); do not reuse them for text or UI.
Use monospace for code, signatures, identifiers, and compact technical labels.
Check contrast for the actual text role; muted tokens are not automatically
suitable for essential body text.

Framed panels (header bar, install steps, code blocks, method cards, dialogs)
use square corners, a 1.5px `--ink` border, and an offset `--plate-shadow`.

## Header, footer, and progress route

- The header is a floating paper bar with corner marks, the same on every page.
  The brand link keeps `aria-label="ARTEL"` and shows the PNG symbol from
  `src/assets/brand/` by theme. Vector uses of the symbol take the coordinates
  in `src/components/ArtelMark.tsx`.
- The header's bottom edge carries the progress route. On the landing, each
  section is a station button labelled with the section title. On install
  pages, stations sit at each section's proportional position and only show
  reading progress (`aria-hidden`). Documentation pages show no route.
- `PageChrome` publishes the header height as `--header-h`; anchors, sticky
  rails, and the table of contents offset by it. At 720px and below the header
  is not sticky and the route is hidden.

## Theme behavior

Let the existing theme control govern the header, body, sidebar, tables, code
blocks, and footer together. Do not force `color-scheme: dark` or a permanent
dark background inside a page. Do not change the site's default theme or stored
preference as a side effect of adding a page.

## Landing

- The hero map is a fixed stage. Scrolling flies the camera to each section's
  region on the same plane; the camera follows scroll linearly, and the snap
  tween (`expo.out`, 1.25s) supplies the easing.
- Snap: one stop per section (hero, § 01–§ 04). Wheel, PageUp/PageDown, arrows,
  Space, Home, and End move one stop. Snap runs only at widths above 720px with
  a fine pointer and no reduced-motion preference (`snapMedia` in
  `src/lib/snap.ts`); elsewhere native scrolling stays. The landing hides the
  browser scrollbar through `html[data-page='landing']`.
- Regions are rendered up front and drawn in their final state. Scene loops and
  the hero route run only while their region is near the viewport and pause
  off-screen.
- Feature details open in a dialog. Hover opens it after a short delay and it
  closes when the pointer leaves both the feature and the dialog. Click or
  keyboard opens it as a modal with focus on the close button; Esc closes it and
  returns focus. Snap is suspended while the dialog is open. At 720px and below
  it is a bottom sheet.
- Reduced motion: no intro, snap, camera flight, or loops; the map and scenes
  rest in their final state. Without the desktop stage (720px and below, or
  reduced motion) each section shows a static map strip with its text stacked
  above it.

## Install pages and documentation

- Install pages restyle the existing markup only: steps are stations on a
  vertical route, screenshots and code are framed screens with a top bar, and
  self-hosting method cards are nodes on a route.
- Documentation and Macro reference keep their layout. Only fonts, accents,
  text colors, and the table of contents' current section
  (`aria-current="location"`) change. Do not add motion to documentation.

## Reference documentation layout

Use familiar documentation structure within the existing site identity:

- A left navigation rail for document groups and search.
- A readable main column for headings, prose, signatures, tables, and examples.
- An optional right table of contents on wide screens.
- Stable section links, a visible current-page state, and previous/next links.
- Existing code-block and copy behavior.

A request for language-reference styling authorizes this information structure;
it does not imply replacing the site's colors, typography, or shared chrome.
Keep the existing header and footer visually continuous with the document body.
Adapt column widths for reading rather than copying Replay Studio panel sizes.
On small screens, keep documentation, navigation, and search usable; allow wide
code and tables to scroll within their containers rather than widening the page.

## Accessibility and visual verification

- Provide semantic headings, labeled navigation and search, keyboard access,
  visible focus, and text labels for states.
- Maintain WCAG AA contrast: at least 4.5:1 for ordinary text and 3:1 for large
  text and meaningful UI boundaries. Respect reduced-motion preferences.
- Verify both light and dark themes through the site's theme control.
- Inspect the complete page with its header and footer, alongside an existing
  page. Check colors, typography, borders, spacing, and theme continuity.
- Verify layouts at 1440px, 1024px, and a mobile width; check overflow, sticky
  navigation, and whether the header obscures section-link targets.
- Verify search, navigation, section links, code copying, and locale switching
  when present. Passing functional checks does not replace visual review.
