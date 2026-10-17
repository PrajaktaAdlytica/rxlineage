# Deploy RxLineage from GitHub to Vercel

Repository: https://github.com/PrajaktaAdlytica/rxlineage

## 1. Import the repository

1. Open https://vercel.com/new and sign in to the intended Vercel account/team.
2. Choose **Import Git Repository**, connect GitHub if needed, and import **PrajaktaAdlytica/rxlineage**. If it is missing, grant the Vercel GitHub app access to this repository.
3. Use these settings (the repository already declares the build settings in `vercel.json`):

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `./` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | `24.x` |
| Production branch | `main` |

4. Click **Deploy**. The complete website source is at the repository root; do not select `src`, `public` or `video` as the root.

No API keys or secrets are required for this concept preview. The build prerenders 31 routes and exports both clean-URL HTML files and directory index files. Keep the supplied `cleanUrls` and `trailingSlash` settings; a catch-all SPA rewrite is unnecessary.

## 2. Confirm the first deployment

Open the generated production URL and test the intro/hero, `/products/source-comparison`, `/demo` and `/request-pilot` directly, including a hard refresh on each path. Confirm the browser title describes that page. Check one phone-sized viewport.

The build resolves canonical/social/sitemap URLs in this order:

1. Explicit `SITE_ORIGIN`, such as `https://your-domain.example`.
2. `https://` plus Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.
3. `https://` plus `VERCEL_URL`.
4. The existing Sites publication as a non-Vercel fallback.

Ensure **Enable access to System Environment Variables** is enabled in Vercel's Environment Variables settings if using automatic domain detection. Alternatively, set `SITE_ORIGIN` to the actual production URL after the first deployment, then redeploy. Do not enter a guessed or unowned domain.

## 3. Add your custom domain

1. In the Vercel project, open **Settings → Domains** and add the domain you own.
2. At your DNS provider, copy the exact DNS records Vercel displays. The values depend on the domain/project; do not reuse a generic IP or CNAME from an old tutorial.
3. Wait until Vercel shows the domain as configured and HTTPS is ready. Choose the intended primary domain/redirect between the apex and `www` if both are used.
4. Set `SITE_ORIGIN=https://your-final-domain` for the Production environment, then redeploy so canonical URLs, social URLs, robots.txt and sitemap.xml use it.

## 4. Future updates

Push or merge to `main` to update production after Vercel is connected. Other branches/PRs can receive preview deployments according to your Vercel settings. Run `npm ci`, `npm run build` and `npm run check` before a release.

The separate `video/` folder contains editable Remotion Studio sources; it is not the website's Vercel build root. See `video/README.md` for its local workflow.

## Functionality boundary

The website and isolated synthetic demo work in the browser. Inquiry forms prepare local drafts and do not deliver leads to email or a CRM. Concept access is not real authentication. Live integrations, analytics and patient data are not connected. Deploying to Vercel does not add those services or establish clinical/compliance claims.

## Official references

- GitHub import and automatic deployments: https://vercel.com/docs/git/vercel-for-github
- Vite builds: https://vercel.com/docs/frameworks/frontend/vite
- Node versions and package engine overrides: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Production-domain environment variable: https://vercel.com/docs/environment-variables/system-environment-variables
- Domain configuration: https://vercel.com/docs/domains/working-with-domains/add-a-domain
