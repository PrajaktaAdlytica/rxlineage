# RxLineage website

Complete responsive, statically prerendered marketing website and isolated synthetic demo. Built from the approved RxLineage IA, Offset Folios brand kit and lavender Modern Apothecary / Evidence in Daylight direction. React 19, TypeScript, Vite and GSAP ScrollTrigger; native scrolling is preserved.

## Run and build

```sh
npm ci
npm run dev
npm run build
npm run check
npm run preview
```

Use the actual local URL printed by Vite; it chooses another port if 4173 is occupied. The build creates 31 prerendered routes in dist, individual titles/descriptions/canonical and social tags, sitemap, favicon/manifest and a custom error page. Serve dist with a static server; do not open it as a file URL.

## Source map

- src/App.tsx: shell, continuous atmosphere, scroll reveals and motion preference.
- src/Home.tsx: dated source hero, reversible story, uncertainty, pharmacist boundary, five modules, case fan, evidence, pricing and conversion.
- src/Pages.tsx: complete module, solution, platform, evidence, evaluation, pricing, resources, company, governance and legal pages.
- src/Demo.tsx: nine fictional episodes, filters, comparison, native evidence dialog, abstention, manual local audit events and JSON export.
- src/Forms.tsx: accessible, draft-only organizational inquiries and honest concept-access page.
- src/components.tsx / src/styles.css: responsive navigation, component/hover system and site-specific composition.
- src/hero-art.json: editable desktop/mobile SVG markup from the approved kit. SVG IDs are namespaced by instance and viewport variant.
- src/content.ts: exact five offers, metric, stop rule, official links and deterministic fixture chronology.
- public/brand: necessary font, logo, icon, background, editable hero and license assets.
- scripts/prerender.tsx and scripts/check.ts: static-route generation and structural/data acceptance checks.
- docs: source verification, coverage, motion, QA and captured browser evidence.

## Current functionality

The company pages and synthetic demo are usable. Menus, module previews, manual case selection, FAQ, source drawer, filters, no-results state, review annotations, reversals and local report downloads work in the browser. No live clinical system, real patient data, outbound message, order change, payment or account login exists.

Inquiry forms validate minimal organizational fields and prepare local downloadable/copyable JSON drafts. They intentionally do not submit. There is no verified delivery address, CRM destination or notice owner supplied in the brief. A submission success is never fabricated. Sign-in opens an explicitly non-authenticated concept preview; it does not collect credentials.

The application has no analytics, cookies, localStorage or sessionStorage. Consent acknowledgment and draft preparation time appear only in an explicitly requested local export. An actual lead service would require approved business ownership, destination, retention, privacy notice and deletion route before implementation. No environment secrets are required for this version.

## Motion and design

One continuous canvas blends limestone, lavender and aubergine between the actual section positions. A copper lineage thread tracks reading progress. The source story uses a sticky evidence panel on sufficiently wide/tall screens, with reversible scroll stages; manual selection stops auto-follow. Narrow/short screens use stacked copy and touch controls. The case fan recenters the selected card on mobile. Forms remain still.

Pause motion stops scroll choreography and shows the complete evidence state. OS reduced-motion CSS/JS fallbacks are included; offscreen SVG motion pauses and hidden-tab CSS animation pauses. Native navigation, anchors, keyboard focus and direct route entry work independently of the story. Read docs/motion-and-coverage.md for page/section responsibilities.

## Publication and next business decisions

.openai/hosting.json binds this project to its private Sites project. Publication preserves owner-private access. This is a concept-preview website, not a clinical product launch. The build metadata origin is the literal origin returned at registration in scripts/prerender.tsx; update it and rebuild when a verified custom domain is actually connected.

A custom domain and a user-selected GitHub/Vercel project have not been connected. Real lead delivery, real authentication, external analytics and any live/data-bearing pilot require a separately specified implementation. Brand/legal review, regulatory intended-use review, data rights and the original pilot prerequisites are not implied by website completion.

For a different verified hosting origin, set `SITE_ORIGIN` when running the build. A vercel.json static-build configuration is included for a later Vercel import; no Vercel deployment or custom DNS change has been performed.
