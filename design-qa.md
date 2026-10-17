# RxLineage — full-screen Ink to Folio revision

**Source visual truth:** `../RxLineage-Intro-Directions/direction-01-ink-to-folio.png`, 1487×1058. The top film region (32,86)–(1455,622) is the selected Option 1. The user's latest instructions override its short landscape presentation: increase the intro to full viewport height and remove navigation from the intro.

**Implementation evidence:** actual browser screenshots in `qa/intro-v2/desktop.jpg` (1440×1000), `tablet.jpg` (775×804), `mobile.jpg` (390×844), and `still.jpg` (1440×1000). Local URL: homepage on the Vite server. Shared composition verified in Remotion Studio with no error overlay. Studio masters are now 1920×1080 and 1080×1920; website composition height follows the actual stage ratio.

## Comparison evidence and normalization

Opened source and implementation together in `qa/intro-v2/reference-comparison.jpg`. The reference film crop is scaled proportionally to 1440×542; the implementation remains its full 1440×1000. Taller composition is intentional, following the user's request, not a normalization error. All browser screenshots have matching CSS/pixel size at density 1. The selected storyboard is not cropped into a shipped background.

Focused typography and mark comparison: `qa/intro-v2/identity-comparison.jpg`, with source and rendered details together at equal pixel widths. Actual source SVG geometry is retained, with a lavender right folio to match the selected reference. Native Newsreader text remains editable and sharp. The generated storyboard's approximate mark is not treated as a replacement for the real logo geometry.

Motion evidence: `frame-000.jpg` and `frame-090.jpg` are actual Studio canvas-region captures at 787×442. The identity is present at frame zero; the headline and note settle in while distinct ink plumes develop around the center. The artwork retains fine translucent wisps and rounded volume.

## Findings, fixes and comparison history

- [P1, fixed] Previous display ramp flattened the reference into marbled color fields. Replaced that display treatment with original generated landscape and portrait ink plates, preserving dimensional folds and fine wisps. The supplied DyeWhorl pressure/velocity/advection pipeline now drives restrained movement of that detailed art. New source/implementation comparison is in `reference-comparison.jpg`.
- [P1, fixed] Previous 2.4:1 strip and visible navigation undercut the opening. Intro now measures exactly one viewport: 1000px, 804px and 844px at the tested sizes. Navigation begins at those exact Y positions and is outside the initial viewport. The header then sticks normally below the film; other routes keep their existing header at Y=0.
- [P2, fixed] Phone text and continuation control approached bright ink. Moved the portrait identity slightly right into the quiet lane and gave continuation controls an opaque plum surface. `mobile.jpg` verifies legibility and comfortable targets.
- [P2, fixed] Header relocation required corrected native anchor offsets and a way to resume from the globally paused still. Measured header height against existing scroll padding; native Skip puts the header at Y=0, hero at Y=89 desktop / Y=75 phone, with keyboard focus on `home-hero`. The static intro provides an Enable motion control when OS preferences permit it.
- The superseded assessment is retained in `docs/intro-v2/superseded-intro-qa.md`; it is explicitly not the current acceptance result.
- No remaining actionable P0/P1/P2 issues in tested states.

## Required fidelity surfaces

- **Fonts/type:** original SVG wordmark; local Newsreader regular/italic and IBM Plex Mono. Reference hierarchy, warm italic emphasis, line spacing and letter spacing are retained. Mobile uses an intentional two-line headline. Small research-stage disclosure remains readable in the dark center.
- **Spacing/layout:** full-screen, uninterrupted opening with large edge plumes and clear center; no nav, floating site controls or letterboxing inside the stage. Navigation starts below it. Native scrolling stays available.
- **Colors/tokens:** deep plum, lavender #B9AACA, limestone #F4F1EA, copper emphasis. The art has natural lighting rather than artificial bands between page sections. No new section gradients, rings or tilted cards.
- **Images/assets:** original high-detail generated artwork in two aspect ratios, optimized to approximately 216KB/241KB WebP. No fake interface image or rasterized typography. Background motion uses 2D flow to advect dimensional artwork; it is not presented as a volumetric 3D simulation. Original assets and exact prompts are saved in `docs/intro-v2/assets/`.
- **Copy/content:** selected headline “Every history has a source.” and explicit “RESEARCH-STAGE CONCEPT.” Existing canonical H1, five module descriptions, synthetic demonstrations, limitations and pilot prerequisites remain intact.

## Verification

- Three viewport screenshots verify full intro height, zero horizontal overflow, no broken loaded images and no navigation over the opening.
- Replay, Play and Pause exercised. Manual Pause held at frame 5 across separate observations. Six-second playback holds its last frame without looping.
- Skip via click and Enter moves keyboard focus to the live hero. During active playback, leaving the intro paused it at frame 13 before its endpoint.
- Global Pause selects the same static implementation used by prefers-reduced-motion, without a Player or WebGL canvas. Static view and inline resumption were tested. OS preference itself was not changed or emulated.
- Product Source Comparison page checked on phone: no intro, header at Y=0, no overflow.
- Console errors checked in the final local run: none. Studio error overlay: none.
- Root and video TypeScript checks pass. Production build and existing 31-route/reference/fixture checks pass. Final packaging repeats the build against the exact published source.

**Limits:** not an MP4 export; this remains an embedded Remotion composition. No forced auto-scroll. Physical device performance, screen-reader behavior, OS preference emulation and forced GPU loss were not exercised. Runtime has static/artwork and component error fallbacks.

final result: passed
