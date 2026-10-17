# RxLineage — sharp vector identity and automatic hero entry

The full-screen Source Reveal keeps its approved 216-frame, 30 fps sequence, moving ink artwork, colors and continuous intro/hero background.

The folio and outlined wordmark now render as three inline SVG paths rather than CSS-scaled image layers. SVG clip rectangles and group transforms preserve the reveal timing. Logo and headline blur filters are removed. A source comparison verified all three path geometries exactly match the approved original logo. Rendered logo groups report filter `none`.

At the end of playback, the page smoothly enters and focuses `home-hero` once. Measured sticky navigation offsets are respected: hero Y=89 at 1280×720 and Y=75 at 390×844. One shared ink canvas remains during the handoff. If a reader already skipped or scrolled beyond the intro, completion leaves their place alone. Replay permits a fresh handoff; Pause stops the timeline and delays entry until playback resumes. Still/reduced-motion presentations do not mount the player and cannot auto-advance.

## Verification

- Remotion Studio frames 70 and 185 visually checked: sharp symbol and complete identity; current error overlay null. Actual final-frame capture: `qa/intro-v6/vector-lockup-studio.jpg`.
- Website first playback automatically finished at frame 215, set handoff to entered, focused the hero and settled below navigation on desktop and phone.
- Pause held frame 2 and scroll position across observations; resuming completed the automatic handoff.
- Replay restarted the timeline. Early Skip focused the hero; completion reported skipped without returning to the intro or changing the reader's scroll position.
- Production preview hydrated successfully on desktop and phone. At 390×844, document width does not overflow; inline SVG paths remain present. Actual phone capture: `qa/intro-v6/mobile-handoff.jpg`.
- Root and video TypeScript, production build and existing checks pass: 31 routes, 1,077 internal references, 1,253 asset references, five modules and nine synthetic fixtures; no check failures.

The approved evidence chapter, synthetic product boundaries, Skip and global motion controls are preserved. Reduced-motion code was preserved and inspected, but OS preference emulation, physical device frame rates, screen-reader operation and forced GPU loss were not exercised in this revision. Previous sequence QA is preserved in `docs/intro-v6/previous-source-reveal-qa.md`.
