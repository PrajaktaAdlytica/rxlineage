# RxLineage — anchored navigation entrance

The homepage header now stays fixed at the viewport's top edge. A measured layout slot preserves its normal footprint between the intro and hero. Its opacity rises only over the last portion of the opening scroll, so a horizontal bar no longer travels through the ink scene. Hidden navigation is removed from visual and keyboard interaction through visibility:hidden until its entrance begins. The bar remains full width, flush to the edges, with no floating shadow or rounded container.

The enhancement is applied after JavaScript initializes the opening. Without it, the header retains its normal sticky layout. Other pages retain their existing navigation behavior.

## Verification

Desktop 1280×720: initial header top=0, height=89, position=fixed and visibility=hidden; hero document offset=809. After arrival, header top=0, opacity=1 and hero top=89. Products menu opened with all five modules present.

Phone 390×844 production preview: during automatic travel at progress 0.333, scrollY=176.5, header top=0, opacity=0 and height=75. The header was absent from the accessibility tree during that hidden interval. After arrival, header top=0, opacity=1 and hero top=75. Mobile menu opened and closed; no horizontal overflow or browser errors. Actual capture: `qa/intro-v9/mobile-navigation.jpg`.

TypeScript, production build and 31-route checks passed, including 1,077 internal references, 1,253 asset references, five modules and nine synthetic fixtures. Physical-device behavior, screen-reader operation and forced loading failures were not exercised.

The ink response, sharp vector identity, 400 ms hold, 3.2-second interruptible handoff, shared background, product content and approved evidence chapter are preserved. Previous QA is retained in `docs/intro-v9/previous-cursor-qa.md`.
