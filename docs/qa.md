# RxLineage website QA

Reviewed 17 October 2026 (Asia/Kolkata). Checks apply to the concept website and browser-local synthetic demo, not to a clinical product or a patient-safety validation.

## Performed checks

- TypeScript strict check and production build pass. Vite emits split React, motion, hero and application bundles; the largest is about 222 kB uncompressed. This is a bundle report, not a measured web-vitals score.
- All 31 prerendered route files have one H1, title, description and canonical metadata. The build includes favicon/manifest, social preview, sitemap and custom error route.
- Structural checks resolve 1,069 internal references and 1,190 local asset references without missing destinations; duplicate SVG/DOM IDs are checked per page. No absolute personal filesystem path appears in production HTML.
- All 31 routes returned HTTP 200 in the local static preview. The explicit custom /404 route was checked; hosted unknown-route handling is checked separately at publication.
- Production browser inspection at 1440×810 covers all five module routes, platform, pricing and evaluation. All 31 route compositions were inspected at 390×844 for document-width overflow, oversized article/form/workbench surfaces and broken loaded images. These DOM/layout checks are recorded in browser-route-checks.json; representative screenshots provide visual evidence.
- Mobile navigation opens and dismisses with Escape, returning focus to its trigger. Desktop product menu lists all five modules. A Company menu and full footer provide company/resource paths.
- Home source story changes stages with native downward scrolling and returns to Sources on reverse/re-entry. Manual stage selection changes to Manual exploration. Pause motion shows the complete evidence state and disables auto-follow; resuming restores motion.
- Direct navigation to /evidence/#alternatives positions the target 114px below the viewport top after fonts and ScrollTrigger layout refresh. In-page demo skip link positions the queue correctly.
- Mobile form empty validation identifies all missing required fields and focuses the role selector. Fictional organizational inputs produce the explicit local-draft state: nothing sent or stored. No delivery success is claimed.
- SYN-003 shows Unknown/Abstained, its missing-detail reason and next reviewer; no record-review action is present.
- Evidence dialog opens with focus on Close evidence and returns focus to its source trigger after closing. Mobile drawer width equals the viewport.
- SYN-001 manual annotation adds a local event; reversal appends a new attributed version and retains the original. Audit view displays the resulting five events.
- Synthetic JSON report download succeeded and contained its synthetic watermark, source references, fictional chronology and retained local events. Example export is in example-synthetic-audit.json.
- Queue no-results state displays 0 of 9 episodes and a clear-filters recovery. Filter/selection controls remain separate from clinical action.
- The fixed cohort contains 9 episodes: 3 pending, 1 in review, 2 abstained, 2 completed, 1 rejected flag. Source ≤ intake ≤ assignment < reviewed chronology is checked. Original five offer descriptions are preserved in order.
- Browser error logs were empty during production route checks. Form/demo source contains no fetch, XMLHttpRequest, beacon or local/session storage. Application analytics and real collection are absent.

Additional responsive checks at 768×1024 and 1024×600 passed document-width checks. The tablet hero uses a single content column; the short-screen source story uses static positioning rather than a sticky panel.

## Observed issues fixed

- SVG desktop/mobile title IDs initially collided; IDs now include the instance and viewport variant.
- The mobile horizontal queue initially expanded its grid track to more than 2,000px. Explicit minimum-width/grid-track rules now keep the queue and record at the available 356px inside a 390px viewport.
- Material texture tiling made a visible horizontal seam. The single canvas now uses seamless vector grain, while material plates are confined to source paper and softly masked dark chapters.
- Mobile source slips overlapped review metadata. Their narrow-screen composition now stacks them with a gap and retains each timestamp/confidence field.
- Initial hash navigation could be reset by layout refresh. The initial target is restored once fonts/layout are ready.
- Mobile case pager now recenters its selected card inside the local fan without scrolling the document.

## Limits

OS reduced-motion CSS/JS handling and no-JavaScript still rules are implemented. The browser tooling did not expose OS preference emulation, so an emulated OS-preference pass is not claimed; the explicit pause path was exercised. No complete assistive-technology audit, multi-browser certification, low-power hardware test or measured field web-vitals study was performed. Do not describe those as passed.

Inquiry delivery, real authentication, live integrations, analytics and custom-domain connection are not implemented or implied. Privacy/terms remain explicitly draft and business-owner review is outstanding. Website completion does not satisfy the eight-interview/blinded-review/champion/funded-scope/signed-approval pilot gate.
