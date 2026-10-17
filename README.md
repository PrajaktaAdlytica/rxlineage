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

The full-screen Source Reveal uses the original vector logo over fluid ink that responds to mouse/pen movement. One ink canvas continues into the hero. A 400 ms hold leads into a 3.2-second interruptible scroll, while the top-anchored navigation fades in. Hero copy, CTA, dated source cards and pharmacist review state enter in sequence. Phone evidence waits until its panel enters the reading area.

Pause and reduced-motion states expose the full content. Skip, native scrolling, keyboard focus, responsive menus and direct route entry remain available. The original approved evidence chapter and five modules are retained. No clinical decision is inferred by an animation.

## GitHub and Vercel

Source repository: https://github.com/PrajaktaAdlytica/rxlineage

Import this repository into Vercel with root directory `./`, Vite preset, `npm ci`, `npm run build`, output `dist`, and Node.js `24.x`. `vercel.json`, `.nvmrc` and the package engine declaration contain these settings. See [the complete deployment guide](docs/DEPLOYMENT.md).

No secrets or environment variables are needed for the demonstration. Vercel's production-domain environment variable generates canonical/social/sitemap URLs; set `SITE_ORIGIN=https://your-verified-domain.example` when using a custom domain. The Sites origin remains the fallback for the existing publication.

`.openai/hosting.json` retains the existing owner-private Sites project binding; it is not a credential. GitHub source publication does not change the Sites audience. Vercel deployment and custom DNS connection are separate steps and have not been performed by this handoff. Inquiry forms remain local drafts; authentication and live integrations are not connected.
