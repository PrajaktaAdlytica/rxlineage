import React, { useState, useEffect, useRef, useId } from "react";
import heroArt from "./hero-art.json";
import {
  moduleNames,
  moduleSlugs,
  moduleDescriptions,
  moduleIcons,
  faqs,
  gateItems,
  pages,
} from "./content";
export const asset = (s: string) => "/brand/assets/" + s;
export function Icon({
  name = "arrow-right",
  className = "",
}: {
  name?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={"icon " + className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <use href={asset("icons/sprite.svg") + "#" + name} />
    </svg>
  );
}
export function Button({
  href,
  children,
  secondary = false,
  light = false,
  className = "",
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  secondary?: boolean;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      className={`button ${secondary ? "secondary flip" : "shutter"} ${light ? "light" : ""} ${className}`}
      {...rest}
    >
      <span className={secondary ? "label-window" : "button-label"}>
        <span>{children}</span>
        {secondary && <span aria-hidden="true">{children}</span>}
      </span>
      <span className="arrow-slot">
        <Icon />
        <Icon />
      </span>
    </a>
  );
}
export function TextLink({
  href,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className="text-link" href={href} {...rest}>
      <span>{children}</span>
      <Icon name="arrow-up-right" />
    </a>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function DemoBadges() {
  return (
    <div className="demo-badges">
      <span>DEMO / SYNTHETIC DATA</span>
      <span>CONCEPT PREVIEW</span>
    </div>
  );
}
export function Chip({
  type = "neutral",
  children,
}: {
  type?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={"chip " + type}>
      <Icon
        name={
          type === "conflict"
            ? "git-compare"
            : type === "unknown"
              ? "circle-question-mark"
              : type === "recorded"
                ? "user-round"
                : "circle-dashed"
        }
      />
      {children}
    </span>
  );
}
const navGroups = [
  {
    name: "Products",
    intro: "Five proposed modules. One accountable workflow.",
    links: moduleNames.map((n, i) => ({
      name: n,
      description: moduleDescriptions[i],
      href: "/products/" + moduleSlugs[i],
      icon: moduleIcons[i],
    })),
    more: "/products",
  },
  {
    name: "Solutions",
    intro: "Start at admission and discharge.",
    links: [
      {
        name: "The problem",
        description: "What makes reconciliation review difficult",
        href: "/problem",
        icon: "files",
      },
      {
        name: "Solution overview",
        description: "Sources, uncertainty and human review",
        href: "/solutions",
        icon: "workflow",
      },
      {
        name: "Admission review",
        description: "Inspect the history behind the arrival",
        href: "/solutions/admission",
        icon: "building",
      },
      {
        name: "Discharge review",
        description: "Make unresolved handoffs visible",
        href: "/solutions/discharge",
        icon: "route",
      },
      {
        name: "Transitions",
        description: "Conditional expansion, with permission",
        href: "/solutions/transitions",
        icon: "git-branch",
      },
    ],
    more: "/solutions",
  },
  {
    name: "Evidence",
    intro: "Know what is established. Define what to test.",
    links: [
      {
        name: "Evidence & limitations",
        description: "Published context, unmeasured performance",
        href: "/evidence",
        icon: "book-open",
      },
      {
        name: "Evaluation protocol",
        description: "Baseline, guardrails and a real stop rule",
        href: "/evaluation",
        icon: "clipboard-list",
      },
      {
        name: "Governance",
        description: "Permissions, intended use and approvals",
        href: "/trust",
        icon: "lock-keyhole",
      },
      {
        name: "Resources",
        description: "Read the workflow behind the concept",
        href: "/resources",
        icon: "file-text",
      },
    ],
    more: "/evidence",
  },
  {
    name: "Company",
    intro: "A careful concept. A defined next step.",
    links: [
      {
        name: "About RxLineage",
        description: "Mission, audience and research stage",
        href: "/about",
        icon: "book-open",
      },
      {
        name: "Contact",
        description: "Organizational questions, no patient data",
        href: "/contact",
        icon: "mail",
      },
      {
        name: "Request a walkthrough",
        description: "Prepare a guided-demo inquiry",
        href: "/request-demo",
        icon: "workflow",
      },
      {
        name: "Resources",
        description: "Original workflow explainers",
        href: "/resources",
        icon: "file-text",
      },
    ],
    more: "/about",
  },
];
export function Header({
  motionPaused,
  onMotion,
  path,
}: {
  motionPaused: boolean;
  onMotion: () => void;
  path: string;
}) {
  const [menu, setMenu] = useState<string | null>(null),
    [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
        if (menu)
          ref.current
            ?.querySelector<HTMLButtonElement>(
              'button[aria-controls="menu-' + menu + '"]',
            )
            ?.focus();
        else trigger.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenu(null);
        setMobile(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menu, mobile]);
  const close = () => {
    setMenu(null);
    setMobile(false);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        className={"site-header " + (mobile ? "mobile-open" : "")}
        ref={ref}
      >
        <div className="nav-shell">
          <a className="brand" href="/" aria-label="RxLineage home">
            <img
              src={asset("logo/rxlineage-horizontal-primary.svg")}
              width="194"
              height="60"
              alt="RxLineage"
            />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navGroups.map((g) => (
              <div className="nav-group" key={g.name}>
                <button
                  aria-expanded={menu === g.name}
                  aria-controls={"menu-" + g.name}
                  onClick={() => setMenu(menu === g.name ? null : g.name)}
                  className={menu === g.name ? "active" : ""}
                >
                  {g.name}
                  <Icon name="chevron-down" />
                </button>
                {menu === g.name && (
                  <div id={"menu-" + g.name} className="mega-menu">
                    <div className="menu-intro">
                      <Eyebrow>Explore RxLineage</Eyebrow>
                      <h2>{g.intro}</h2>
                      <TextLink href={g.more}>View overview</TextLink>
                    </div>
                    <div className="menu-links">
                      {g.links.map((l) => (
                        <a
                          href={l.href}
                          key={l.href}
                          aria-current={path === l.href ? "page" : undefined}
                        >
                          <Icon name={l.icon} />
                          <div>
                            <strong>{l.name}</strong>
                            <span>{l.description}</span>
                          </div>
                          <Icon name="arrow-up-right" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <a
              className="nav-direct"
              href="/platform"
              aria-current={path === "/platform" ? "page" : undefined}
            >
              Platform
            </a>
            <a
              className="nav-direct"
              href="/pricing"
              aria-current={path === "/pricing" ? "page" : undefined}
            >
              Pricing
            </a>
          </nav>
          <div className="nav-actions">
            <a className="signin-link" href="/sign-in">
              Sign in
            </a>
            <Button
              href="/request-pilot"
              className="nav-pilot"
              aria-label="Request a scoped pilot"
            >
              <span className="nav-full-label">Request a scoped pilot</span>
              <span className="nav-short-label">Scoped pilot</span>
            </Button>
            <button
              className="menu-toggle"
              ref={trigger}
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              aria-controls="mobile-navigation"
              onClick={() => setMobile(!mobile)}
            >
              <Icon name={mobile ? "x" : "menu"} />
            </button>
          </div>
        </div>
        {mobile && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-nav"
          >
            {navGroups.map((g) => (
              <details key={g.name}>
                <summary>
                  {g.name}
                  <Icon name="plus" />
                </summary>
                {g.links.map((l) => (
                  <a href={l.href} onClick={close} key={l.href}>
                    {l.name}
                    <Icon name="arrow-up-right" />
                  </a>
                ))}
                <a href={g.more} onClick={close}>
                  View all {g.name.toLowerCase()}
                </a>
              </details>
            ))}
            <a href="/platform">Platform</a>
            <a href="/pricing">Pricing</a>
            <a href="/resources">Resources</a>
            <a href="/about">About RxLineage</a>
            <a href="/contact">Contact</a>
            <a href="/sign-in">Concept access</a>
            <Button href="/request-pilot">Request a scoped pilot</Button>
          </nav>
        )}
      </header>
      <button
        className="motion-control"
        onClick={onMotion}
        aria-pressed={motionPaused}
        title={motionPaused ? "Enable motion" : "Pause motion"}
      >
        <Icon name={motionPaused ? "play" : "pause"} />
        <span>{motionPaused ? "Enable motion" : "Pause motion"}</span>
      </button>
    </>
  );
}
export function HeroArt({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const artRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = artRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          el.classList.toggle("art-visible", e.isIntersecting),
        ),
      { rootMargin: "40px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);
  const item =
    (heroArt as Record<string, { desktop: string; mobile: string }>)[slug] ||
    heroArt.home;
  const prepare = (s: string, variant: string) =>
    s
      .replace(/id="([^"]+)"/g, (_, n) => `id="${uid}-${variant}-${n}"`)
      .replace(
        /aria-labelledby="([^"]+)"/g,
        (_, ids) =>
          `aria-labelledby="${ids
            .split(" ")
            .map((n: string) => uid + "-" + variant + "-" + n)
            .join(" ")}"`,
      )
      .replace(/url\(#([^\)]+)\)/g, (_, n) => `url(#${uid}-${variant}-${n})`);
  return (
    <div ref={artRef} className={"hero-art " + className}>
      <div
        className="art-desktop"
        dangerouslySetInnerHTML={{ __html: prepare(item.desktop, "d") }}
      />
      <div
        className="art-mobile"
        dangerouslySetInnerHTML={{ __html: prepare(item.mobile, "m") }}
      />
    </div>
  );
}
export function PageHero({
  slug,
  description,
  tag = "Research-stage concept",
  cta = true,
  jump,
}: {
  slug: string;
  description: string;
  tag?: string;
  cta?: boolean;
  jump?: [string, string];
}) {
  const p = pages.find((x) => x.slug === slug) || pages[0];
  return (
    <section
      className={"page-hero section hero-" + slug}
      data-tone="paper"
      style={
        {
          "--hero-pattern": `url(${asset("backgrounds/" + p.background + ".svg")})`,
        } as React.CSSProperties
      }
    >
      <div className="container hero-grid">
        <div className="hero-copy" data-reveal>
          <Eyebrow>{tag}</Eyebrow>
          <h1>{p.headline}</h1>
          <p className="lead">{description}</p>
          {jump && <TextLink href={jump[1]}>{jump[0]}</TextLink>}
          {cta && (
            <div className="actions">
              <Button href="/request-pilot">Request a scoped pilot</Button>
              <TextLink href="/demo">Explore the synthetic demo</TextLink>
            </div>
          )}
          <p className="concept-note">
            Concept preview. No operating product, clinical guidance or live
            integrations.
          </p>
        </div>
        <div className="hero-visual">
          <HeroArt slug={slug} />
          <p className="visual-caption">
            {p.readingPath} <span>Illustrative workflow</span>
          </p>
        </div>
      </div>
    </section>
  );
}
export function SectionTitle({
  label,
  title,
  children,
  center = false,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={"section-title " + (center ? "center" : "")} data-reveal>
      <Eyebrow>{label}</Eyebrow>
      <h2>{title}</h2>
      {children && <p className="section-lead">{children}</p>}
    </div>
  );
}
export function ModuleList({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <div className={"module-layout " + (compact ? "compact" : "")}>
      <div className="module-rows">
        {moduleNames.map((name, i) => (
          <article
            className={"module-row " + (active === i ? "selected" : "")}
            key={name}
          >
            <button
              className="module-select"
              aria-pressed={active === i}
              aria-label={"Preview " + name}
              onClick={() => setActive(i)}
            >
              <span className="module-number">0{i + 1}</span>
              <Icon name={moduleIcons[i]} />
            </button>
            <div>
              <a className="module-title" href={"/products/" + moduleSlugs[i]}>
                {name}
              </a>
              <p>{moduleDescriptions[i]}.</p>
              <span className="proposed">
                Proposed module {i === 1 ? "· Initial pilot focus" : ""}
              </span>
            </div>
            <a
              className="module-arrow"
              href={"/products/" + moduleSlugs[i]}
              aria-label={"Explore " + name}
            >
              <Icon name="arrow-up-right" />
            </a>
          </article>
        ))}
      </div>
      <div className="module-preview">
        <HeroArt key={active} slug={moduleSlugs[active]} />
        <TextLink href={"/products/" + moduleSlugs[active]}>
          Explore {moduleNames[active]}
        </TextLink>
      </div>
    </div>
  );
}
export function FAQ({ items = faqs }: { items?: string[][] }) {
  return (
    <section className="section faq-section" data-tone="paper">
      <div className="container faq-grid">
        <div data-reveal>
          <Eyebrow>A few things worth asking</Eyebrow>
          <h2>
            Careful questions.
            <br />
            <em>Clear boundaries.</em>
          </h2>
          <TextLink href="/contact">Start a conversation</TextLink>
        </div>
        <div className="faq-list">
          {items.map(([q, a], i) => (
            <details key={q}>
              <summary>
                <span>{q}</span>
                <span className="faq-sign">
                  <Icon name="plus" />
                </span>
              </summary>
              <div className="faq-answer">
                <p>{a}</p>
                {i === 1 && (
                  <a href="/evaluation">Read the evaluation approach</a>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Gates() {
  return (
    <ol className="gates">
      {gateItems.map((g, i) => (
        <li data-reveal key={g}>
          <span className="gate-number">0{i + 1}</span>
          <div>
            <h3>{g}</h3>
            <p>
              {
                [
                  "Understand the buyer, operator and current workflow.",
                  "Agree the cohort, reference set and pharmacist scoring.",
                  "A named champion must co-own the evaluation.",
                  "A bounded, paid scope with an accountable budget owner.",
                  "No evaluation data before the required reviews.",
                ][i]
              }
            </p>
          </div>
          <span className="pending">Required · not achieved</span>
        </li>
      ))}
    </ol>
  );
}
export function Closing({
  title = "Evaluate the workflow.\nDefine the evidence.",
}: {
  title?: string;
}) {
  return (
    <section className="closing section" data-tone="mist">
      <div className="closing-orbit" aria-hidden="true" />
      <div className="container" data-reveal>
        <Eyebrow>A pharmacist-led next step</Eyebrow>
        <h2>
          {title.split("\n").map((t, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {i === 1 ? <em>{t}</em> : t}
            </React.Fragment>
          ))}
        </h2>
        <p>
          Start with the review your team already owns.
          <br />
          Agree what would make a bounded evaluation worth pursuing.
        </p>
        <Button href="/request-pilot">Request a scoped pilot</Button>
        <p className="small">
          For pharmacy directors, medication-safety leads and informatics
          champions.
        </p>
      </div>
    </section>
  );
}
export function Footer() {
  const cols = [
    [
      "Proposed modules",
      ...moduleNames.map((n, i) => [n, "/products/" + moduleSlugs[i]]),
    ],
    [
      "Explore",
      ["Platform", "/platform"],
      ["Problem", "/problem"],
      ["Solutions", "/solutions"],
      ["Synthetic demo", "/demo"],
      ["Pricing hypothesis", "/pricing"],
    ],
    [
      "Evidence",
      ["Research & limitations", "/evidence"],
      ["Evaluation", "/evaluation"],
      ["Governance", "/trust"],
      ["Resources", "/resources"],
    ],
    [
      "Company",
      ["About RxLineage", "/about"],
      ["Contact", "/contact"],
      ["Request a demo", "/request-demo"],
      ["Concept access", "/sign-in"],
    ],
  ];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a href="/" aria-label="RxLineage home">
            <img
              src={asset("logo/rxlineage-horizontal-reverse.svg")}
              width="210"
              height="65"
              alt="RxLineage"
            />
          </a>
          <p>
            Different sources.
            <br />
            <em>An accountable review.</em>
          </p>
          <div className="socials">
            <span title="LinkedIn profile not yet available">
              <img
                src={asset("icons/brand-linkedin.svg")}
                alt="LinkedIn — profile not yet available"
              />
            </span>
            <span title="Crunchbase profile not yet available">
              <img
                src={asset("icons/brand-crunchbase.svg")}
                alt="Crunchbase — profile not yet available"
              />
            </span>
            <small>Profiles not yet available</small>
          </div>
        </div>
        <div className="footer-cols">
          {cols.map((c, i) => (
            <div key={i}>
              <h3>{c[0] as string}</h3>
              {c.slice(1).map((l, j) => (
                <a href={(l as string[])[1]} key={j}>
                  {(l as string[])[0]}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2026 RxLineage · Research-stage concept</p>
          <div>
            <a href="/legal/privacy">Privacy notice</a>
            <a href="/legal/terms">Terms</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
        <p className="footer-disclosure">
          Synthetic demonstrations only. Not an operating product or clinical
          guidance. No efficacy, adoption, savings or compliance claim is
          established. RxLineage is a working brand; name and trademark review
          remain pending.
        </p>
      </div>
    </footer>
  );
}
