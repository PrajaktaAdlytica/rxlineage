# Superseded: user rejected the first intro implementation

The following previous QA assessment is retained for history. It does not describe the current intro. The current design-qa.md corrects the visual fidelity failure.

# RxLineage intro — selected direction 1

Source visual truth: `../RxLineage-Intro-Directions/direction-01-ink-to-folio.png` (1487×1058 design board). User selected option 1. The user-supplied DyeWhorl React/WebGL component and existing brand-kit SVG/fonts take precedence over painted approximations in that board.

Implementation: `/` on the local Vite preview; `qa/intro/desktop-website.jpg` (1440×1000), `qa/intro/tablet-website.jpg` (775×804), `qa/intro/mobile-website.jpg` (390×844), plus global-pause proof `qa/intro/mobile-still.jpg`. The shared Remotion composition is also visible in Studio. Browser captures, not generated UI images.

## Comparison evidence

Full-view comparison: `qa/intro/reference-comparison.jpg`. Board film crop (32,86)–(1455,622), excluding the storyboard annotations and thumbnails, normalized to 1440×600; actual composition frame 90 captured at exactly 1440×600 CSS/pixels, density 1. Normalization adjusts the storyboard's approximately 2.65:1 crop to the planned 2.4:1 composition; no claim of pixel-identical framing.

Focused comparison: `qa/intro/type-detail-comparison.jpg`, source and implementation together. The real reverse SVG is retained in its original monochrome form, superseding the generated two-color approximation. Local Newsreader regular/italic, IBM Plex Mono and original website Source Sans 3 are loaded. Letterforms, italic emphasis, text wrapping, scale and alignment were inspected.

Portrait composition: 1080×1260 master; actual 390×455 composition capture in `qa/intro/mobile-keyframe.jpg` and full mobile website proof. The 1080×1260 browser capture supplies the optimized portrait poster for sharper high-density displays. Desktop poster is 1440×600. Separate composition rather than desktop shrink-to-fit.

## Findings and iteration history

- Development: an unscoped screen-reader heading was visually exposed, and a bottom label crowded the scroll control. Added a scoped visually-hidden rule and removed extraneous labels. Revised full website captures show a clear center and control area.
- [P2, fixed] Replay/time controls had variable contrast over limestone ink. Replaced the translucent treatment with an opaque plum control group and minimum 44px target heights. Post-fix evidence: `qa/intro/desktop-website.jpg`, `qa/intro/tablet-website.jpg`.
- [P2, fixed] Native anchor scrolling counted both the site's existing scroll padding and an additional intro scroll margin. Removed the extra margin, made the target focusable and verified Enter focuses `home-hero`; top offset is 114px desktop / 94px mobile. Offscreen detection now accounts for the fixed header.
- No remaining actionable P0/P1/P2 issues in the selected intro's tested states.

## Required fidelity surfaces

- Typography: original logo SVG, local brand fonts, restrained copper italic emphasis; no rasterized lettering in the active composition. Fallbacks are actual composition captures.
- Spacing/layout: centered identity, open reading corridor, two distinct edge plumes; tablet and portrait checked for clipping and overflow. Controls remain separate from film markup.
- Colors/tokens: plum #281D34, lavender #B9AACA, limestone #F4F1EA and copper emphasis #C3A18B. No generic blue, light-purple page surface, section shading bands, rings or tilted elements added.
- Image/effect fidelity: the background uses the supplied incompressible fluid solver, pressure projection and MacCormack transport. This is intentionally procedural ink, with a flatter illustrated appearance than the volumetric raster in the storyboard. No storyboard crop, fake product screenshot, replacement logo drawing or stock image ships. The two color channels remain distinct.
- Copy/content: “Every history has a source.” and “RESEARCH-STAGE CONCEPT.” Canonical product H1 and all clinical/synthetic disclaimers remain below. No clinical action is depicted by the intro.

## Interactions and verification

- Six-second / 180-frame / 30fps silent playback reaches frame 179 once and holds. Replay verified; manual Pause froze frame 6 across separate observations; Play resumed.
- Native scroll is not intercepted. Skip via click and Enter verified; keyboard focus reaches the hero.
- Offscreen playback paused at frame 12 (before ending) with the hero at its anchor offset. Returning resumes unless manually paused or ended.
- Global Pause motion replaces the runtime with the readable, loaded still poster; tested on mobile. The prefers-reduced-motion branch uses this same still rendering and does not mount the Player. OS accessibility settings were not changed for testing.
- Responsive checks: 1440×1000, 775×804 and 390×844. No horizontal overflow, broken images or clipped intro controls. Three intro targets measured 44px at tablet width.
- Console errors checked: none in the final website run. Vendor license reminder is informational. Studio desktop frame seeking verified; Studio and website TypeScript checks pass.
- Production build and existing site checks pass: 31 prerendered routes; 1,077 internal references; 1,253 asset references; original nine synthetic fixtures and five offers retained.

## Limits and intentional adaptations

The intro is an embedded, frame-driven Remotion composition, not an MP4 export. It holds above the live hero; the reader continues through native scroll or the explicit link. The shared plum field provides continuity without auto-scrolling or moving page content. The exact generated 3D ink texture and a forced cinematic cut to the hero are not reproduced. Reduced-motion browser emulation, physical iOS/Android hardware and forced GPU loss were not exercised; code provides poster/error-boundary fallbacks.

final result: passed
