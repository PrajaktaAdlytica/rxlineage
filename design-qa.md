# RxLineage — cursor-driven ink repair

Cursor events already reached the simulation, but the pointer velocity impulse was being multiplied by the 1/60-second solver step as if it were an ambient acceleration. The correction converts the stroke velocity into the force expected by the integrator, restoring the full bounded impulse each fixed step. The existing velocity cap, smoothing, pressure projection and material-coordinate transport are retained.

Pointer moves are captured on the shared opening's parent before descendant handlers can stop propagation. Coordinates are checked against the actual canvas viewport; moving outside or onto links/buttons clears the pointer. Mouse and pen require no button press. Touch remains available for native page scrolling.

## Verification

Real browser pointer strokes increased the live canvas sample count from 0 to 64 and reported smoothed pointer velocity above 300 cells/second. Additional pointer moves between native click locations increased samples to 66 without a held drag. Intro and hero both accepted input through the same canvas. Visual inspection after strokes showed displaced lavender ink folds. These observations confirm input and live rendering; they are not a physical-device benchmark.

Pause set runtime playing=false, cleared pointerActive and froze ink time at 86.817. Browser error log was empty. Root and video TypeScript, production build and 31-route checks passed: 1,077 internal references, 1,253 asset references, five modules and nine synthetic fixtures, with no failures.

The approved artwork, palette, sharp inline SVG identity, 400 ms final hold, 3.2-second interruptible hero handoff and single shared ink background are retained. Studio composition was open before changes; deterministic playback has no cursor input and retains the original unforced animation. Physical pen/touch hardware, screen readers, forced GPU loss and OS motion emulation were not exercised.

Previous QA is in `docs/intro-v8/previous-cinematic-handoff-qa.md`. Current visual capture: `qa/intro-v8/cursor-stir.jpg`.
