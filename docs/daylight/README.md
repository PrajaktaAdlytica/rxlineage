# Daylight background rebuild

17 October 2026. This revision includes the line-removal work and responds to the subsequent feedback about muddy shading and mismatch with the selected direction.

Revisited the approved lavender Modern Apothecary / Evidence in Daylight image and Dawn recording frames. Replaced the entire long linear-gradient system and stacked ambient-light masks. There is no longer a computed ivory-to-plum colour interpolation, the source of the grey bands.

The environment now uses an uninterrupted ivory canvas, layered lavender filled surfaces beneath page heroes, and solid plum chapter environments with clean curved boundaries. Adjacent dark sections share one environment. Filled lavender surfaces gently move with native scrolling; no outlined path wallpaper is used. The approved “Two histories” aperture and its local motion remain intact.

Source Comparison retains the new evidence board and scroll-dependent field highlighting. Source IDs, uncertainty and human review states remain visible. Motion never makes an adjudication.

Verification: TypeScript, production build, prerender and automated references passed. Browser checks on all 31 routes at 390px found no document overflow, broken images, decorative line elements or computed long background gradient. Visually inspected the homepage and light/dark transition at 1440px; reviewed the dark chapter boundary on mobile. Physical-device and full assistive-technology checks were not performed.
