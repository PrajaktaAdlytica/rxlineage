# RxLineage — coordinated hero entrance

A shared GSAP entrance now coordinates the hero text and synthetic evidence. The previous independent copy, source-card and receipt entrance tweens have been replaced. Headline and supporting content rise gently, followed by the source records, source connection, unresolved review receipt and pharmacist reviewer. All elements settle upright.

## Sequence

Desktop begins when the arriving hero reaches 88% of the viewport during the existing intro handoff. Times relative to that trigger:

- 0.00s: eyebrow; 0.12s: main headline.
- 0.32s: evidence header; 0.40s: evidence caption in two beats; 0.54s: synthetic/concept badges.
- 0.58s: supporting copy; 0.94s: CTA and text link, staggered by 0.16s.
- 0.94s: first source card; 1.22s: second source card. Each rises 34px over 1.05s.
- 1.32s: concept note; 1.56s: source connection.
- 1.82s: unresolved review receipt; 2.19s: pharmacist reviewer; 2.44s: panel footer.
- Complete evidence sequence settles at approximately 3.09s.

On layouts at or below 760px, copy follows the same rhythm. Evidence waits until its own panel reaches 70% of the viewport, then runs the source-to-review sequence. This prevents the offscreen cards spending their entrance while the reader is still in the hero copy.

The shared hero surface becomes visible earlier in the ink dissolve so the entrance can be seen during the handoff. Ink artwork, cursor response, vector logo, 400 ms hold, 3.2-second interruptible scroll and anchored header are retained.

## Verification

Desktop browser initial state: headline and both cards hidden in their prepared positions. During a native Skip entrance, headline opacity was 0.0478 while both cards and the receipt remained at 0, confirming copy leads the evidence. Final hero/scene states were complete; headline, cards and reviewer opacity=1; card transforms were identity matrices; one shared ink canvas remained and the header stayed at Y=0.

Phone 390×844 production preview: after the hero copy entered, evidence remained waiting with both cards at opacity=0. Scrolling the evidence panel into view completed its separate sequence. Global Pause restored headline/cards to visible with opacity=1; resuming worked. Browser error log was empty.

TypeScript, production build and 31-route checks passed: 1,077 internal references, 1,253 asset references, five modules and nine synthetic fixtures, no failures. Actual captures are in `qa/intro-v10/`. OS preference emulation, physical device frame rates and screen-reader operation were not exercised. Reduced motion is excluded from entrance media queries and the existing Pause path reverts animation styles to the complete content.

No clinical actions, recommendations, sign-off automation or content claims were added. Previous QA is preserved in `docs/intro-v10/previous-navigation-qa.md`.
