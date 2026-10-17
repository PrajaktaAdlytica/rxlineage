# RxLineage — Ink to Folio

Six-second silent introduction, selected direction 1. The website uses a Remotion Player, not a downloaded MP4. It plays once, holds its last frame, and leaves native scrolling available.

The composition source is shared with the homepage at `../src/intro/InkToFolio.tsx`. Desktop/mobile registrations in `src/Composition.tsx`: 1920×800 and 1080×1260, 30 fps, 180 frames each.

From the website root, run `npm ci`. From this folder, run `npm ci` and `npm run dev -- --no-open`. Studio shares the website's public folder and React runtime. The optional local capture harness is `/video/capture.html` on the website's Vite dev server; add `?mobile=1` for portrait. It is not a production route.

The supplied DyeWhorl shader pipeline is adapted in `../src/intro/ink-tank.ts`: fixed time steps, edge injection, two ink channels, no pointer tracking, finite injection, a clean reading area and capped portrait resolution. Original wordmark SVG and licensed local fonts are reused. Reduced-motion visitors receive actual browser-captured WebP keyframes without WebGL initialization. Global Pause motion also selects that still. Context failure uses the same poster. Offscreen and hidden-tab playback pauses; Replay is explicit.

No clinical decision, recommendation, approval, patient data or source reconciliation is depicted. The product preview and its disclosures remain in the existing hero below.
