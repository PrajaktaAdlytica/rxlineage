# RxLineage — fluid motion and continuous opening

Request: make the ink more natural like the supplied DyeWhorl component and remove the abrupt intro-to-hero background change. Accepted Option 1 artwork, palette, logo-first entrance, full-height intro and approved chapter remain intact.

## Motion changes

Removed the display shader's standing sine waves, hard displacement clamp and instantaneous velocity distortion. Two staggered material-coordinate fields now transport the detailed artwork under the projected fluid velocity. Each field renews at zero visual weight, with a smooth blend between them. Softer source forces, lower vorticity/buoyancy, more desktop pressure iterations and smoothed pointer position/velocity reduce pinching and elastic-looking movement. A fixed-step accumulator handles frame timing; browser drawing targets 60 Hz, rather than assuming a measured device frame rate.

This is 2D fluid-driven transport of the accepted illustrated artwork, not volumetric simulation or an MP4. Studio remains deterministic and frame-driven. Original source illustrations and prompts remain in `docs/intro-v2/`.

## One scene across intro and hero

`OpeningAtmosphere.tsx` supplies one sticky viewport surface spanning the intro, navigation and hero. The same WebGL canvas is portaled into it; it is not replaced at the section boundary. Scroll gradually quiets the ink behind the reading content and fades the intro identity. The hero is transparent over the same #211A29 plum base. Home navigation now has a translucent plum surface and the existing reverse brand SVG, removing the cream interruption. Other pages keep their established header.

No section-edge gradients, decorative lines, tilted elements, forced scrolling or clinical state changes were introduced. The scene ends with the hero and does not extend across the approved chapter.

## Browser evidence

Actual screenshots: `qa/intro-v4/desktop.jpg`, `transition.jpg`, `hero.jpg`, `mobile.jpg`, `mobile-transition.jpg`, `mobile-still-hero.jpg`, `tablet.jpg`. Desktop 1440×1000, tablet 775×804, phone 390×844.

- Desktop: exactly one canvas, ten native cursor samples; observed ink motion past 30 seconds. At scroll Y=500 the same canvas remains at viewport Y=0 with artwork opacity 0.42976. At Y=1000 hero begins at Y=89, same fluid remains active with opacity 0.12. The hero has no opaque section background.
- Phone: 390px document width, 844px stage and canvas. At Y=422 the same canvas stays at Y=0. At Y=844 hero begins at Y=75, ink still active. No horizontal overflow. Header starts below the intro.
- Native phone menu click preserved scroll Y=834 and header Y=10; menu contents remain readable. Desktop product dropdown checked. Automation locator clicks can center a below-fold header, so native coordinates were used to verify the actual menu behavior.
- Manual Pause froze fluid simulation time at 15.750 across separate reads. After the shared scene left the viewport, motion was inactive at time 15.783. Global Pause removed both Player and canvas while retaining the portrait artwork, plum base and correct scroll opacity. Native scrolling remains available.
- Studio error overlay: none. Local browser error log: empty. Root/video TypeScript and production build pass. Existing checks pass across 31 routes, 1,077 internal references, 1,253 asset references and nine synthetic fixtures.

## Limits

Physical-device frame rate, pen/touch hardware, screen-reader operation, OS reduced-motion emulation and forced GPU loss were not exercised. Existing reduced-motion and error fallbacks are retained. Final source is rebuilt and packaged before publication. Remaining product copy, five offers, synthetic evidence states and research-stage boundaries are unchanged.
