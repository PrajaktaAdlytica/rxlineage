# Ink to Folio — full-screen revision

The selected reference is `../../../RxLineage-Intro-Directions/direction-01-ink-to-folio.png` in the delivery outputs. The user rejected the flat ink ramp and short stage. This revision preserves the reference's rounded volume, translucent wisps, central two-color folio mark, headline and copper italic, with the requested full-screen height and navigation below the intro.

Two original raster plates were generated with the built-in `image_gen` tool, using the selected storyboard as a visual reference. These contain only artwork; no logo, interface or text is baked in. They are generated illustrations with photographic depth, not clinical imagery or actual photographs.

| Asset | Original source | Website version |
| --- | --- | --- |
| Landscape, 1672×941 | `assets/ink-to-folio-landscape-v2.png` | `../../public/media/ink-to-folio-landscape-v2.webp` |
| Portrait, 941×1672 | `assets/ink-to-folio-portrait-v2.png` | `../../public/media/ink-to-folio-portrait-v2.webp` |

Exact prompts: `assets/ink-to-folio-landscape-v2.prompt.txt` and `assets/ink-to-folio-portrait-v2.prompt.txt`. Both used built-in image generation, not the CLI fallback. Raw files are preserved; only format/quality optimization was applied to the WebP copies (about 216 KB and 241 KB).

The original SVG geometry is reused in `public/brand/assets/logo/rxlineage-horizontal-reverse-accent.svg`; its right folio takes the kit's #B9AACA lavender. The wordmark and left folio remain limestone. The original SVG files are preserved.

`src/intro/ink-tank.ts` retains the user-supplied DyeWhorl velocity advection, pressure projection, vorticity/buoyancy and MacCormack transport. Its display pass now uses an accumulated, advected displacement field from projected 2D fluid velocity, plus secondary wisp movement. Side emitters persist, and mouse/pen strokes inject smoothed momentum. The website continues this ambient motion after the finite identity entrance; Studio remains deterministic. It is not a volumetric 3D fluid simulation. This preserves the selected artwork's depth while giving it real frame-driven movement. No pointer capture or scroll interception is used.

The responsive Remotion composition uses the actual stage aspect ratio. Studio masters are 1920×1080 and 1080×1920, 180 frames at 30 fps. Phone art has its own composition. Typography and the SVG remain editable, not rasterized.

The still fallback uses these same background plates with responsive HTML text and the original SVG; it does not initialize WebGL. It remains sharp at changing viewport ratios. Native navigation follows the full-height stage, and keeps its normal sticky behavior for the rest of the homepage. Other pages retain their existing navigation.
