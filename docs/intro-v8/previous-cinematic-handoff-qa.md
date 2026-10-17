# RxLineage — cinematic intro-to-hero handoff

The approved 7.2-second Source Reveal and sharp inline vector identity are preserved. Its final pose now holds for 400 ms, then travels into the hero over 3.2 seconds. A finite requestAnimationFrame sequence uses smootherstep easing, with zero velocity and acceleration at both ends, rather than the browser's brief default smooth scroll.

The original ink canvas stays mounted across the entire opening. Scroll progress gradually fades the intro identity, brings in the product scene, and quiets the ink over the full journey instead of darkening it early. The same background remains visible at 18% opacity beneath the settled hero. No artwork, new section backgrounds, rings, logo paths, product copy or approved evidence chapter were changed.

Native wheel, touch, pointer and navigation-key input cancel the automatic travel immediately. Resize, hidden tabs, pause, unmount and replay also clean up the transition. A reader who already skipped beyond the intro retains their place. Keyboard focus moves to the hero only after the automatic journey completes. Reduced-motion presentations expose the complete hero without its entrance fade and do not mount the autoplay player.

## Verification

A deterministic timing/interaction harness verified the initial 400 ms hold, gradual midpoint, 3.2-second travel, sticky-header destination, focus only at completion, wheel cancellation without further scrolling, and complete listener/frame cleanup.

Browser production preview: desktop 1280×720 and phone 390×844 reached frame 215, handoff progress 1.000 and entered state, with hero focused at Y=89 and Y=75 respectively. A desktop intermediate observation measured progress 0.526, scrollY=395 and heroY=414. Native upward scroll interrupted that travel; replay then completed correctly. One shared ink canvas stayed mounted. Phone document width did not overflow. Production browser error log was empty.

Root and video TypeScript, build and existing route/reference/fixture checks pass: 31 routes, 1,077 internal references, 1,253 asset references, five modules and nine synthetic fixtures; no check failures. Current captures are in `qa/intro-v7/`; previous QA is retained in `docs/intro-v7/previous-vector-handoff-qa.md`.

The simulation/artwork and Remotion timeline were not modified. Physical-device frame rates, touch hardware, screen-reader operation, OS preference emulation and forced GPU loss were not exercised. Pause/still/reduced-motion code paths remain intact.
