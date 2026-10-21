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
- `src/components/SiteLayout.tsx`: header, navigation, footer, and theme control.
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
| Layout and radii | Existing layout and radius tokens in `tokens.css` |

Do not add hard-coded page palettes or alternate font stacks. Page-specific
variables may alias shared tokens when needed; they must not duplicate colors.
Use monospace for code, signatures, identifiers, and compact technical labels.
Check contrast for the actual text role; muted tokens are not automatically
suitable for essential body text.

## Theme behavior

Let the existing theme control govern the header, body, sidebar, tables, code
blocks, and footer together. Do not force `color-scheme: dark` or a permanent
dark background inside a page. Do not change the site's default theme or stored
preference as a side effect of adding a page.

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
