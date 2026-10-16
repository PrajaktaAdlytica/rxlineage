import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { pages, moduleDescriptions, episodes } from "../src/content";
const failures: string[] = [];
let internal = 0,
  assets = 0;
const assert = (x: boolean, msg: string) => {
  if (!x) failures.push(msg);
};
for (const p of pages) {
  const f = "dist" + (p.route === "/" ? "" : p.route) + "/index.html";
  assert(existsSync(f), "Missing route " + p.route);
  if (!existsSync(f)) continue;
  const html = readFileSync(f, "utf8");
  assert(
    (html.match(/<h1[ >]/g) || []).length === 1,
    "One H1 required " + p.route,
  );
  assert(
    html.includes("<title>") &&
      html.includes('name="description"') &&
      html.includes('rel="canonical"'),
    "Metadata " + p.route,
  );
  const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (x) => x[1]);
  assert(new Set(ids).size === ids.length, "Duplicate IDs " + p.route);
  for (const m of html.matchAll(
    /<(a|img|script|link|use)[^>]+(?:href|src)="([^"]+)"/g,
  )) {
    const href = m[2];
    if (href.startsWith("http") || href.startsWith("data:")) continue;
    const [base, hash] = href.split("#");
    if (
      base.startsWith("/brand/") ||
      base.startsWith("/assets/") ||
      base === "/texture-grain.svg"
    ) {
      assets++;
      assert(existsSync("dist" + base), "Missing asset " + base);
    } else if (m[1] === "a") {
      internal++;
      const route = (base.split("?")[0] || p.route).replace(/\/$/, "") || "/";
      const page = pages.find((x) => x.route === route);
      assert(!!page, "Unknown internal route " + href + " from " + p.route);
      if (hash && page) {
        const target = "dist" + (route === "/" ? "" : route) + "/index.html";
        assert(
          readFileSync(target, "utf8").includes(`id="${hash}"`),
          "Missing anchor " + href + " from " + p.route,
        );
      }
    }
  }
  assert(!html.includes("/Users/"), "Personal path in " + p.route);
}
const home = readFileSync("dist/index.html", "utf8");
for (const d of moduleDescriptions)
  assert(home.includes(d), "Original offer missing " + d);
assert(episodes.length === 9, "Nine episodes");
const counts = episodes.reduce(
  (c, e) => ((c[e.state] = (c[e.state] || 0) + 1), c),
  {} as Record<string, number>,
);
for (const [k, n] of Object.entries({
  pending: 3,
  "in-review": 1,
  "blocked-abstained": 2,
  completed: 2,
  "rejected-flag": 1,
}))
  assert(counts[k] === n, "Fixture count " + k);
for (const e of episodes) {
  assert(
    +new Date(e.assignedAt) >= +new Date(e.intakeAt),
    "Assignment chronology " + e.id,
  );
  assert(
    e.sourceObservedAt.every((s) => +new Date(s) <= +new Date(e.intakeAt)),
    "Source chronology " + e.id,
  );
  if (e.reviewedAt)
    assert(
      +new Date(e.reviewedAt) > +new Date(e.assignedAt),
      "Review chronology " + e.id,
    );
}
assert(existsSync("dist/social-preview.png"), "Social preview exists");
const source =
  readFileSync("src/Forms.tsx", "utf8") + readFileSync("src/Demo.tsx", "utf8");
assert(
  !/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/.test(source),
  "No form/demo transmission or persistence",
);
const result = {
  checkedAt: new Date().toISOString(),
  routes: pages.length,
  internalReferences: internal,
  assetReferences: assets,
  fixtureCounts: counts,
  failures,
};
mkdirSync("docs", { recursive: true });
writeFileSync("docs/automated-checks.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
