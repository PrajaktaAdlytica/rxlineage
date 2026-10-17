# Motion, CTA and chapter-edge refinement

17 October 2026. Current revision, following the split-opening update.

## Chapter edges

Removed the full-page colour-stop gradient from ApprovedChapterBackdrop. The chapter now has a solid #281d34 canvas at both boundaries. Removed the separate bottom-centred radial wash; retained the central plum light, original copy, original circular composition and source-linked evidence trace. The original middle appearance is the reference; the formerly frozen edge treatment is explicitly revised at the user's request. The existing circle now also scales with native scroll at tablet/mobile widths.

## Motion and controls

- SVG illustration stages and their evidence paths follow native scroll. Product-page heroes use the whole hero as their timing range, with the first source visible initially and later stages revealed as the user scrolls. Module selection plays a bounded sequential illustration rather than ending before the user sees it.
- The comparison stays mounted while its evidence drawer expands/collapses, including when scrolling backwards or using stage controls.
- Unsent clarification drafts type once when visible. The complete question remains accessible to screen readers. Leaving the viewport, hiding the page, or pausing stops typing and displays the full draft. No send, sign-off or clinical state is triggered by animation.
- Proposed before/after lists reveal in sequence. Content cards remain straight.
- Pill CTAs use a fill sweep, rolling label and arrow hand-off. Keyboard focus receives the same visual response as pointer hover. Touch retains direct, readable CTAs.
- The closing scene uses one original photo-style archival-paper asset, compressed to a 183,112-byte WebP, with a small native-scroll pan/zoom. No outline paths, travelling rings, moving stripes, or fades between sections are introduced. See background-asset.md for the generation prompt and master path.

Pause and reduced-motion styles expose complete still states. Native scrolling and the existing story navigation remain available.

## Verification

TypeScript, Vite production build, 31-route prerender and reference/fixture checks passed. Browser QA used 1440x1000, the user's 775x804 viewport, and 390x844. All 31 mobile routes had no document overflow, broken loaded images, clipped CTA labels or rotated panels. The final console check was clear.

Observed forward/reverse hero illustration staging, source-to-evidence drawer changes, full unsent draft typing, tablet circle scaling, and the closing image transform. Verified keyboard CTA focus: the fill completed, the label rolled by its line height and the replacement arrow reached its resting position. Pause displayed complete SVG stages, source cards and draft text. The review remained unresolved and the draft remained unsent.

Screenshots and mobile-route-checks.json are in this folder. Full physical-device and assistive-technology testing were not performed. Inquiry forms remain local draft tools; no product integration or transmission service was added.
