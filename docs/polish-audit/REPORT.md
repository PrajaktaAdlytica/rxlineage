# RxLineage — Dawn comparison and polish

Reviewed the supplied 65-second Dawn recording again, the selected lavender Modern Apothecary / Evidence in Daylight direction, and the running website. This pass adapts Dawn's atmospheric arc, large circular geometry and explanatory miniature scenes to the original RxLineage identity.

## 1. Atmosphere — improved

Before: near-grey paper, weak lavender, framed hero illustrations and little distinction between page families. After: a continuous paper-to-lavender-to-plum canvas, richer directional light, restrained grain and copper tracing. Ambient fields blend at their boundaries. Product art floats directly in the environment. Page families use different lighting arrangements; quieter legal reading surfaces remain restrained.

[Before source hero](02-before-module.jpg) · [After source hero](10-after-source-module.jpg) · [Homepage](04-after-home.jpg)

## 2. Story and motion — improved

A large expanding evidence aperture introduces the central narrative. The desktop source workbench follows three scroll stages and retraces on upward scroll. Product heroes have separate comparison, queue, rejected-flag, unsent-draft and audit scenes. Entrances, orbital movement, text reveals and light parallax are coordinated with native scroll. Scroll never changes a pharmacist decision. Pause restores visible static content; reduced-motion handling remains in place.

[Story chapter](05-after-story.jpg) · [Queue hero](06-after-queue.jpg)

## 3. Mobile — improved

The two source folios now fit side by side in a compact composition. Each of the three mobile story explanations is immediately followed by its corresponding evidence visual. Full desktop sticky behavior is reserved for suitable viewports. Module scenes reflow to a single reading column.

[Mobile opening](07-after-mobile.jpg) · [Source folios](08-after-mobile-folios.jpg) · [Draft scene](09-after-mobile-draft.jpg)

## Verification

- TypeScript, Vite production build and 31-route prerender passed.
- Automated checks: 1,075 internal references, 1,222 asset references; no failures.
- Browser route checks at 1440×810 and 390×844: all 31 routes had headings, no document horizontal overflow and no broken images.
- Visually inspected homepage, source hero, queue hero, dark chapter and mobile source/draft layouts.
- Verified source/difference/evidence progression by scrolling; motion pause and enable states; production bundle hydration.
- No new efficacy, adoption, compliance or integration claims. Existing five offers, synthetic fixtures, human ownership and evaluation gates retained.

Limits: browser viewport checks are not physical-device testing or a full assistive-technology audit. The hosted preview retains owner-private access. Inquiry forms remain local draft preparation; this pass does not add a submission service.
