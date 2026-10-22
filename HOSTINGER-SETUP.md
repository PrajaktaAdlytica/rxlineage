# RxLineage Hostinger deployment

Built from main commit ea3765605d87d4192737770a0adf8782cef43e4a.
Canonical origin: https://www.rxlineage.com

This branch contains ready-to-serve static files. Select Custom PHP/HTML hosting,
repository PrajaktaAdlytica/rxlineage, branch hostinger-deploy, deploy directory public_html.
Do not select main or configure a Node build/server. Enable auto-deployment for this branch.
Legacy Git UI: repository URL https://github.com/PrajaktaAdlytica/rxlineage.git,
branch hostinger-deploy, installation path blank for public_html.
Back up existing files before replacing any nonempty target.

Connect rxlineage.com and www.rxlineage.com to this website using the exact DNS
records Hostinger supplies. Preserve email records. Enable SSL for both names,
force HTTPS, and configure the root domain to redirect to https://www.rxlineage.com.
Verify the homepage, /products/source-comparison, and an unknown URL (HTTP 404).

## Updating
The editable React source remains on main. This is a separate generated branch.
Pushing main alone does not rebuild this branch.
In the source checkout with Node 24: npm ci, then
SITE_ORIGIN=https://www.rxlineage.com npm run build
npm run check
Copy the contents of dist into a checkout of hostinger-deploy, preserving .git,
this guide, and .htaccess; remove obsolete assets. Remove dist's _headers file
(Hostinger headers are in .htaccess). Commit and push hostinger-deploy.
Hostinger auto-deploys that push when connected. Never merge this branch into main.

Forms remain local draft previews; no email delivery or authentication backend.
Official setup: https://docs.hostinger.com/websites/git
