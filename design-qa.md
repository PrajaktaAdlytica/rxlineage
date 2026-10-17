# RxLineage — The Source Reveal

The user approved the proposed dramatic symbol-first opening. This revision implements that sequence over the accepted moving ink scene. Fluid solver, artwork, palette, continuous intro/hero surface and existing site content remain unchanged.

## Sequence

216 frames at 30 fps (7.2 seconds), followed by held identity and continuing ambient ink:

- 0–1.2s: anticipation; ink alone.
- 1.2–1.95s: limestone folio reveals upward; 1.65–2.5s: lavender half joins with its own reveal.
- 2.5–3.4s: enlarged centered symbol settles into the existing horizontal lockup. No rotation.
- 2.55–3.5s: wordmark resolves beside the symbol.
- 3.5–4.2s: “Every history has a” enters; 4.55–5s: copper italic “source.” follows after a deliberate pause.
- 5.15–5.75s: research-stage note appears; remaining time holds the complete identity.

The logo layers are derived directly from the original SVG. An XML comparison confirms all three original path attribute sets are preserved exactly. No brand geometry, icon or favicon was replaced.

## Verification

Actual Studio frame captures in `qa/intro-v5/`: 24 (anticipation), 48 (first half), 70 (folio), 102 (brand), 130 (prefix), 150 (headline), 185 (hold). At frame 130, rendered prefix opacity is 1 and source opacity is 0. Portrait symbol/hold captures are also included. Studio error overlay: none. A three-panel contact sheet in delivery outputs uses those actual captures.

Website checks: 1440×1000 and 390×844; final logo/headline composition matches the accepted pose. Phone stage is 844px, document width 390px, and broken completed images count is zero. Replay returned to frame 0 with every identity layer at opacity 0. At the end, identity holds at frame 215 while ink continues. Pause kept reported fluid time at 61.833 across reads.

Skip focused `home-hero`, positioned at Y=75 on phone; one shared ink canvas remains. Global Pause removed Player and canvas, set intro mode to still, and displayed the complete fallback identity. Loading mode hides the fallback text to preserve anticipation; reduced-motion, error and no-script paths retain the still identity. Forced load failures and OS preference emulation were not exercised.

A separate Vite production preview served the prerendered output and hydrated successfully. Browser error log: empty. Root and video TypeScript, production build and existing route/reference/fixture checks pass. Current checks cover 31 routes, 1,077 internal references, 1,253 asset references and nine synthetic fixtures. Final packaging rebuilds the exact published source.

The approved chapter, five offers, synthetic demo boundaries, full-screen intro, skip/pause controls, native scrolling and shared background are preserved. Physical-device frame rates, screen-reader operation, pen/touch hardware and forced GPU loss are not tested.
