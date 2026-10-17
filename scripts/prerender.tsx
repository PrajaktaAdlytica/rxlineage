import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { App } from "../src/App";
import { pages } from "../src/content";
const template = readFileSync("dist/index.html", "utf8");
// Vercel supplies its production domain at build time, including previews.
// An explicit approved custom domain always takes precedence.
const origin = new URL(
  process.env.SITE_ORIGIN ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://rxlineage.artfullarch32.chatgpt.site"),
).origin;
const descriptions: Record<string, string> = {
  home: "A proposed source-attributed medication-history workflow for pharmacist review at admission and discharge. Explore the synthetic concept.",
  pricing:
    "Hypothetical test price: $3,000 per hospital site per month plus $8,000 evaluation setup. Research-stage concept, not an active offer.",
  demo: "Explore nine synthetic medication-history reconciliation episodes. Browser-local demonstration; no clinical guidance or live connections.",
};
for (const p of pages) {
  const title =
    p.name === "Home"
      ? "RxLineage — Evidence for pharmacist-led review"
      : `${p.name} — RxLineage`;
  const desc =
    descriptions[p.slug] ||
    `${p.headline} Research-stage RxLineage concept for source-attributed, pharmacist-led review. Synthetic demonstrations only.`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${desc}">`,
    )
    .replace(
      "</head>",
      `<link rel="canonical" href="${origin}${p.route}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${p.route}"><meta property="og:image" content="${origin}/social-preview.png"><meta name="twitter:card" content="summary_large_image"></head>`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${renderToString(<App initialPath={p.route} />)}</div>`,
    );
  if (p.route === "/404") {
    writeFileSync("dist/404.html", html);
    mkdirSync("dist/404", { recursive: true });
    writeFileSync("dist/404/index.html", html);
  } else {
    const dir = "dist" + (p.route === "/" ? "" : p.route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(dir + "/index.html", html);
    // Clean-URL hosts resolve /about to about.html. Retain directory exports
    // for hosts that serve /about/ from about/index.html.
    if (p.route !== "/") writeFileSync("dist" + p.route + ".html", html);
  }
}
writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
writeFileSync(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    pages
      .filter(
        (p) =>
          p.route !== "/404" && p.route !== "/demo" && p.route !== "/sign-in",
      )
      .map((p) => `<url><loc>${origin}${p.route}</loc></url>`)
      .join("") +
    "</urlset>",
);
writeFileSync(
  "dist/_headers",
  "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'none'\n",
);
console.log(
  `Prerendered ${pages.length} routes, metadata, sitemap and error page.`,
);
