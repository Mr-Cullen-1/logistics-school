# Coliseum Logistics — Logo Pack

Prepared from the original transparent logo supplied in ChatGPT.

## Included assets

### `brand/` — master brand exports
- `coliseum-logo-stacked-brand.png` — original stacked composition, transparent.
- `coliseum-logo-horizontal-brand.png` — horizontal lockup for light backgrounds.
- `coliseum-logo-horizontal-white.png` — horizontal lockup with dark navy details changed to white, for dark backgrounds.
- `coliseum-mark-brand.png` — standalone architectural symbol.
- `coliseum-mark-white.png` — white-compatible standalone symbol.

### `public/brand/` — website-ready copies
Same horizontal and mark assets, plus:
- `favicon-64.png`
- `apple-touch-icon-180.png`
- `icon-192.png`
- `icon-512.png`

### `src/app/icon.svg`
Square Next.js app icon file. It embeds the transparent mark PNG to preserve the supplied artwork.

## Recommended mapping for the current platform audit
- Login + admin sidebar + learner sidebar: `public/brand/coliseum-logo-horizontal-white.png` on dark backgrounds.
- Design system / light surfaces: `public/brand/coliseum-logo-horizontal-brand.png`.
- Browser tab: `src/app/icon.svg` (or `public/brand/favicon-64.png` if using a conventional favicon link).
- Future Apple/PWA icons: corresponding PNG exports in `public/brand/`.

## Important technical note
The supplied original is a 256×256 transparent WEBP raster, not a vector source. PNG exports are enlarged with high-quality resampling; this does not create true vector detail. The SVG app icon embeds the PNG rather than tracing it into vector paths. For genuinely crisp, infinitely scalable SVGs, the original editable vector (AI, EPS, PDF, or source SVG) is needed.

The horizontal lockup is a layout adaptation of the supplied stacked artwork. Please visually approve it before replacing production assets.
