# RxLineage — interactive Ink to Folio revision

The user accepted Option 1's artwork and full-screen composition, then requested visible continuous ink movement, cursor interaction from their DyeWhorl component, and logo appearing before text. The accepted landscape/portrait artwork, logo geometry, brand colors, navigation placement and rest of the site are preserved.

## Motion and interaction

- Logo is hidden at frame zero. It reveals from 0.25–1.4 seconds; headline follows at 1.65–2.85; research-stage note follows at 3.05–3.8. Actual Studio captures: `qa/intro-v3/timeline-{0,30,70,120}.jpg`. Studio has no error overlay.
- The six-second identity timeline ends without looping the words. Website fluid continues independently at a capped 30 updates/second, with fixed simulation steps. Persistent side emitters, projected velocity, and an advected bounded displacement field transport the accepted ink artwork. This is 2D fluid-driven artwork, not a volumetric 3D simulation or MP4.
- Real native cursor drag through the left ink registered nine pointer samples. Mouse/pen movement needs no click; velocity-smoothed and spatially subsampled strokes inject momentum into the fluid. No cursor-following decorative ring is used. `moving-a.jpg` / `moving-b.jpg` capture different settled-timeline ink states.
- Pause/Play remains available after the timeline ends; Replay separately restarts the identity entrance. Paused fluid simulation time stayed exactly 11.067 across separate reads. Matching mobile paused captures are retained. Offscreen time stayed exactly 16.317 across separate reads, with motion inactive.
- Pointer listeners are passive, never capture the pointer, and ignore touch to preserve native mobile scrolling. Physical touch hardware and pen input were not exercised.

## Responsive and visual checks

Browser viewports: 1440×1000, 775×804 and 390×844. Intro remains one full viewport; phone stage measured 844px, header begins at 844px, document width equals 390px. Current tablet/phone captures are in `qa/intro-v3/`. Small concept-note text has a dark backing on portrait layouts so moving ivory ink cannot reduce its contrast. The interaction hint is hidden on portrait/coarse-pointer layouts to avoid overlap with continuation controls.

Native mobile Skip moves focus to `home-hero`, with header at Y=0 and hero at Y=75 after the smooth scroll settles. Offscreen ink pauses. No navigation was reintroduced over the intro. No new decorative lines, section shading, tilted elements, clinical actions or product claims were added. Reference/artwork provenance remains in `docs/intro-v2/artwork.md`; the previous full-screen assessment is retained in `docs/intro-v3/previous-fullscreen-qa.md`.

## Checks and limits

Root production build and video TypeScript pass. Existing checks cover 31 routes, 1,077 internal references, 1,254 asset references, all five modules and nine synthetic fixtures without failures. Local browser error log: empty. Studio error overlay: none. Reduced-motion/global-pause still selection and no-GPU fallback from the prior revision are retained. OS preference emulation, screen-reader behavior, physical-device performance and forced GPU loss are not tested in this revision.
