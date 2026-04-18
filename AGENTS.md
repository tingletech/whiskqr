# AGENTS.md

## Commands
- `npm run dev` — start dev server (HTTPS required for camera access)
- `npm run build` — typecheck + production build
- `npm run test` — build + sanity check (manifest, sw.js, icons, bundle sizes)
- `npm run preview` — preview production build locally

## Architecture
- Single-screen PWA: scanner → result → restart. No routing.
- `src/components/Scanner.tsx` — lazy-loaded wrapper around `html5-qrcode`
- `src/components/Html5QrcodeScanner.tsx` — actual scanner (code-split chunk)
- PWA via `vite-plugin-pwa` in `generateSW` mode (workbox)

## PWA
- `vite-plugin-pwa` auto-generates `manifest.webmanifest` + service worker
- Icons at `public/pwa-192x192.png` and `public/pwa-512x512.png` (generated from `public/icons/icon.svg`)
- Camera access requires HTTPS or `localhost`

## Gotchas
- `html5-qrcode` has no separate CSS — override via `!important` in `App.css` targeting `#reader__*` selectors.
- Scanner config uses `rememberLastUsedCamera` (not `rememberSelectedDevice`), no `showCameraSelection`.
- Success callback: `(decodedText: string, result: Html5QrcodeResult) => void` — first arg is the string.
- Do NOT use project references in `tsconfig.json` — Vite/esbuild conflict. Use flat config.
- Camera permission is requested on mount, cleaned up on unmount via `scanner.clear()`.
- React component must NOT be named `Html5QrcodeScanner` — that name is used by the library.
- Vite `base` is `/whiskqr/` for GitHub Pages deployment — local dev uses default (`/`).
- `torch` property is not in standard `MediaTrackSettings` — use custom interface cast.
- `html5-qrcode` built-in torch button uses `MediaCapabilities` API (not available on iOS). Custom button uses `applyVideoConstraints` with `torch: true/false` via `advanced` constraints.

## Style conventions
- Mobile-first CSS, dark theme, no CSS framework
- Max-width 480px container centered on desktop
- Safe area insets for notch devices (`env(safe-area-inset-*)`)
- All library style overrides use `!important` targeting `#reader__*` IDs
- Flash button: `position: absolute` overlay, `z-index: 10`, `border-radius: 50%`

## Tests
- `npm run test` runs build + validates manifest, service worker, icon references, and bundle sizes
- Sanity check script at `scripts/sanity-check.js`

## Deploy
- Push to `main` triggers automatic deploy via `.github/workflows/deploy.yml`
- Deployed to GitHub Pages at `https://<username>.github.io/whiskqr/`
- Environment `github-pages` must be configured in repo settings
