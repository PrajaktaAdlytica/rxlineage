# Final website QA and GitHub handoff

Reviewed 17 October 2026. Target repository: `PrajaktaAdlytica/rxlineage`, branch `main`.

## Fixed during final QA

Direct extensionless deep links were falling back to homepage HTML in the static preview. React then corrected the visible page, but metadata remained wrong and hydration could recover from the mismatch. The exporter now emits matching `route.html` and `route/index.html` outputs. All 31 routes subsequently returned the correct page title and canonical URL without new browser errors. The structural checker verifies that both exports exist and match.

Vercel readiness: explicit Vite/npm build settings, Node 24 engine and `.nvmrc`, ignored local environment/Vercel files, and automatic production-domain metadata with an explicit `SITE_ORIGIN` override. No dependencies or product visuals were changed.

## Passed

- Clean `npm ci` installation on Node v24.19.0.
- Root TypeScript, production build and structural/data checks: 31 routes, 1,077 internal references, 1,253 asset references, all five original modules and nine consistent synthetic fixtures.
- Separate video project TypeScript check.
- Production dependency audit: zero reported vulnerabilities at review time.
- Browser route rendering at 1280×720 and 390×844: all 31 routes had one H1, no document-width overflow and no broken completed images. Route-specific metadata was checked on desktop. Raw results: `final-browser-routes.json` and `final-mobile-routes.json`.
- Tablet 1024×768 checks passed for the homepage, source comparison and pricing, with no overflow or broken completed images. Raw results: `final-tablet-routes.json`.
- Mobile navigation opened and closed on a product page. Desktop navigation and the anchored homepage header were reviewed in the existing sequence QA.
- Empty pilot inquiry produced six validation states and focused the first invalid field. Fictional organizational inputs prepared a local draft with explicit “nothing sent” messaging.
- Demo search produced a recoverable no-results state; Clear filters restored the queue. Abstained filter returned two cases. SYN-003 displayed the abstention banner. Its source-evidence dialog opened/closed and pharmacist-review/audit views worked.
- Canonical-origin precedence exercised for explicit domain, Vercel production URL, preview URL and existing-site fallback.
- Known credential/private-key token patterns were scanned in tracked source and 501 historical Git blobs before publication; no matches were found. No runtime secrets are required.

## Established motion QA retained

The final desktop run reached frame 215, handoff entered, complete hero/card sequences, header Y=0 and hero Y=89. Native cursor input produced nine pointer samples with live fluid velocity. Products navigation opened/closed, and no new browser errors were captured. The full-screen vector-logo intro, shared ink, interruptible handoff and phone sequence also retain the checks in `design-qa.md` and `qa/intro-v*`. Complete static content is available through Pause/reduced-motion paths.

## Limits and remaining setup

Vercel account import, a live Vercel deployment, DNS and custom-domain HTTPS require the steps in `DEPLOYMENT.md`; they are not claimed complete. Forms remain local drafts, concept access has no real authentication, and live integrations/analytics are absent. No clinical efficacy, customer or certification claim was added.

Physical-device frame rates, assistive-technology operation and forced GPU/network failures were not tested in this final pass. Structural/browser QA is not a certification of clinical or regulatory suitability.
