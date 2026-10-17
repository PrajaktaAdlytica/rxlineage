# RxLineage — Ink to Folio, full-screen revision

The six-second silent Remotion introduction fills the viewport. The homepage navigation follows it and sticks normally as the reader enters the site. Native scroll, Skip intro, keyboard focus, Pause/Play and explicit Replay remain available. The film holds its final frame; it never auto-scrolls.

The shared source is `../src/intro/InkToFolio.tsx`. Studio registrations in `src/Composition.tsx` are 1920×1080 and 1080×1920, 30 fps, 180 frames. On the website, the Player adapts its composition height to the actual viewport to avoid letterboxing.

From the website root, run `npm ci`. From this folder, run `npm ci` and `npm run dev -- --no-open`. Studio shares the website's public folder and React runtime. The optional local capture harness is `/video/capture.html` on the Vite dev server, with `?mobile=1` for portrait; it is not a production route.

Original generated ink artwork, source prompts and motion implementation are documented in `../docs/intro-v2/artwork.md`. The supplied DyeWhorl fluid pipeline drives movement of those detailed ink plates. Original SVG geometry and local brand typefaces remain editable. The lavender right folio matches the selected reference.

Reduced motion and global Pause select a responsive static plate with live HTML text and SVG, with no GPU setup. Offscreen and hidden-tab playback pause. Context loss falls back to the static plate. The inline Enable motion control resumes from global Pause when OS motion preferences permit it.

This is an embedded composition, not an exported MP4. The brand film depicts no clinical action, recommendation, patient data or automated adjudication. Existing synthetic product previews and disclosures remain below it.
