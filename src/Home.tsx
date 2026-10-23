import React, { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Button,
  TextLink,
  Eyebrow,
  DemoBadges,
  Chip,
  Icon,
  ModuleList,
  HeroArt,
  SectionTitle,
  Closing,
  FAQ,
} from "./components";
import { stopRule, sources } from "./content";
import { ApprovedChapterBackdrop } from "./ApprovedChapterBackdrop";
import { HeroEvidenceScene } from "./HeroEvidenceScene";
import { DraftReveal } from "./DraftReveal";
import { Intro } from "./intro/Intro";
import { OpeningAtmosphere } from "./intro/OpeningAtmosphere";
import { MotionContext } from "./motion-context";
export function SourceFolios() {
  return (
    <div
      className="source-orbit"
      aria-label="Two dated synthetic source records disagree on the status of Medication X."
    >
      <DemoBadges />
      <div className="orbit-index">
        SYN–002
        <br />
        ONE EPISODE / TWO ACCOUNTS
      </div>
      <article className="source-folio source-a">
        <div className="folio-top">
          <span>01 / REPORTED</span>
          <Icon name="file-text" />
        </div>
        <h3>Reported history</h3>
        <p className="source-meta">
          SRC-002A · 12 OCT 2026
          <br />
          08:20 UTC
        </p>
        <hr />
        <label>Medication</label>
        <p>Medication X</p>
        <label>Recorded status</label>
        <div className="source-value conflict">Reported current</div>
        <hr />
        <p className="folio-foot">
          Confidence: not validated
          <br />
          Owner: Pharmacist Reviewer B
        </p>
      </article>
      <article className="source-folio source-b">
        <div className="folio-top">
          <span>02 / DATED HISTORY</span>
          <Icon name="files" />
        </div>
        <h3>Dated pharmacy history</h3>
        <p className="source-meta">
          SRC-002B · 05 OCT 2026
          <br />
          12:00 UTC
        </p>
        <hr />
        <label>Medication</label>
        <p>Medication X</p>
        <label>Recorded status</label>
        <div className="source-value conflict">Different recorded status</div>
        <hr />
        <p className="folio-foot">
          Confidence: not validated
          <br />
          Received: 12 Oct · 08:25 UTC
        </p>
      </article>
      <div className="orbit-conflict">
        <Chip type="conflict">Conflicting</Chip>
      </div>
      <p className="orbit-caption">
        A closer look.
        <br />
        <em>Not a conclusion.</em>
      </p>
    </div>
  );
}
export function Comparison({ stage = 2 }: { stage?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionContext);
  useEffect(() => {
    if (paused || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".comparison-columns article",
        { y: 16, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 92%",
            end: "center 70%",
            scrub: 0.55,
          },
        },
      );
    }, root);
    return () => context.revert();
  }, [paused]);
  return (
    <div ref={root} className={"comparison-surface story-stage-" + stage}>
      <div className="product-toolbar">
        <span>
          <Icon name="git-compare" />
          Source comparison
        </span>
        <span className="mono">SYN-002</span>
      </div>
      <DemoBadges />
      <div className="comparison-columns">
        <article>
          <span className="source-index">SOURCE A</span>
          <h3>Reported history</h3>
          <p className="source-meta">
            SRC-002A
            <br />
            12 Oct 2026 · 08:20 UTC
          </p>
          <div className="comparison-field">
            <label>Medication</label>
            <strong>Medication X</strong>
          </div>
          <div className="comparison-field difference">
            <label>Recorded status</label>
            <strong>Reported current</strong>
          </div>
        </article>
        <article>
          <span className="source-index">SOURCE B</span>
          <h3>Dated history</h3>
          <p className="source-meta">
            SRC-002B
            <br />
            05 Oct 2026 · 12:00 UTC
          </p>
          <div className="comparison-field">
            <label>Medication</label>
            <strong>Medication X</strong>
          </div>
          <div className="comparison-field difference">
            <label>Recorded status</label>
            <strong>Different recorded status</strong>
          </div>
        </article>
      </div>
      <div className="comparison-summary">
        <Chip type="conflict">Conflicting</Chip>
        <span>Neither source is promoted to truth.</span>
      </div>
      <div className="evidence-reveal-grid" aria-hidden={stage !== 3}>
        <div className="evidence-reveal-clip">
          <div className="inline-evidence">
            <Icon name="panel-right-open" />
            <div>
              <strong>Evidence remains attached.</strong>
              <p>
                Both received 12 Oct · 08:25 UTC
                <br />
                Version 1 · Pharmacist Reviewer B<br />
                Confidence: not validated · Review unresolved
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="product-bottom">
        <span>For pharmacist adjudication</span>
        <span>Next review · 10:30 UTC</span>
      </div>
    </div>
  );
}
function StorySequence() {
  const motionPaused = useContext(MotionContext);
  const [stage, setStage] = useState(1),
    [follow, setFollow] = useState(true);
  const auto = useRef(true);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    auto.current = follow;
  }, [follow]);
  useEffect(() => {
    if (motionPaused) {
      if (auto.current) setStage(3);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 901px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
      () => {
        const triggers = Array.from(
          root.current?.querySelectorAll<HTMLElement>(".walk-step") || [],
        ).map((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => {
              if (auto.current) setStage(i + 1);
            },
            onEnterBack: () => {
              if (auto.current) setStage(i + 1);
            },
          }),
        );
        return () => triggers.forEach((t) => t.kill());
      },
    );
    return () => mm.revert();
  }, [motionPaused]);
  return (
    <section
      id="story"
      ref={root}
      className="story-sequence section"
      data-tone="mist"
    >
      <div className="container walk-grid">
        <div className="walk-copy">
          <article className="walk-step">
            <Eyebrow>01 / The source</Eyebrow>
            <h2>
              One episode.
              <br />
              Two accounts.
              <br />
              <em>A question to resolve.</em>
            </h2>
            <p>
              Medication histories can be incomplete or disagree. Before
              deciding what deserves review, a pharmacist needs to see where
              each account came from.
            </p>
            <a
              className="inline-source"
              href={sources.ahrq}
              target="_blank"
              rel="noreferrer"
            >
              Workflow context: AHRQ MATCH toolkit <Icon name="external-link" />
            </a>
            <div className="walk-mobile-visual">
              <Comparison stage={1} />
            </div>
          </article>
          <article className="walk-step">
            <Eyebrow>02 / The difference</Eyebrow>
            <h2>
              Keep the date.
              <br />
              <em>Keep the difference.</em>
            </h2>
            <p>
              One list reports a medication as current. An older history records
              a different status. That is a conflict to inspect—not a reason to
              treat either account as the answer.
            </p>
            <p className="marginal-note">
              A newer source is not automatically authoritative.
            </p>
            <div className="walk-mobile-visual">
              <Comparison stage={2} />
            </div>
          </article>
          <article className="walk-step">
            <Eyebrow>03 / The evidence</Eyebrow>
            <h2>
              Every flag needs
              <br />
              <em>a way back.</em>
            </h2>
            <p>
              Open the evidence behind an item: source ID, observed and received
              times, completeness and reviewer. Confidence remains explicitly
              unvalidated.
            </p>
            <TextLink href="/products/source-comparison">
              Explore Source Comparison
            </TextLink>
            <div className="walk-mobile-visual">
              <Comparison stage={3} />
            </div>
          </article>
        </div>
        <div className="walk-demo">
          <div className="story-tabs" aria-label="Source story stages">
            {["Sources", "Difference", "Evidence"].map((t, i) => (
              <button
                key={t}
                aria-pressed={stage === i + 1}
                onClick={() => {
                  setFollow(false);
                  setStage(i + 1);
                }}
              >
                <span>0{i + 1}</span>
                {t}
              </button>
            ))}
          </div>
          <Comparison stage={stage} />
          <div className="story-control">
            <span>
              {motionPaused
                ? "Motion paused · use stage controls"
                : follow
                  ? "Following scroll on larger screens"
                  : "Manual exploration"}
            </span>
            <button onClick={() => setFollow(!follow)}>
              {follow ? "Use stage controls" : "Follow scroll"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
function CaseFan() {
  const [selected, setSelected] = useState(1);
  const fan = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionContext);
  useEffect(() => {
    const el = fan.current;
    if (!el || innerWidth > 760) return;
    const card = el.children[selected] as HTMLElement;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
      behavior:
        paused || matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
    });
  }, [selected, paused]);
  const items = [
    {
      id: "SYN-001",
      title: "A clean handoff",
      status: "Completed",
      type: "recorded",
      owner: "Reviewer A",
      time: "12 Oct · 09:10 UTC",
      body: "Displayed sources agree. A fictional pharmacist records the review. No claim of complete history or clinical clearance.",
    },
    {
      id: "SYN-002",
      title: "An honest exception",
      status: "Conflicting",
      type: "conflict",
      owner: "Reviewer B",
      time: "Next review · 10:30 UTC",
      body: "Dated sources disagree. Keep the evidence visible and the review unresolved. The clarification draft remains unsent.",
    },
    {
      id: "SYN-003",
      title: "A visible abstention",
      status: "Unknown",
      type: "unknown",
      owner: "Reviewer C",
      time: "Next review · 11:00 UTC",
      body: "A required detail is missing. Insufficient evidence to prioritize the item. Abstention stays in the record.",
    },
  ];
  return (
    <section className="case-section section" data-tone="paper">
      <div className="container">
        <SectionTitle
          label="Three synthetic cases"
          title="Different evidence. Different states."
          center
        >
          Good review design has room for uncertainty—and for saying there is
          not enough evidence.
        </SectionTitle>
        <div className="case-fan" ref={fan}>
          {items.map((c, i) => (
            <button
              key={c.id}
              className={"case-card " + (selected === i ? "selected" : "")}
              data-position={i - selected}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span className="case-id">{c.id} / SYNTHETIC CASE</span>
              <div className="case-art">
                <Icon
                  name={i === 0 ? "files" : i === 1 ? "git-compare" : "eye-off"}
                />
                <span className="case-art-line" />
              </div>
              <h3>{c.title}</h3>
              <Chip type={c.type}>{c.status}</Chip>
              <p>{c.body}</p>
              <span className="case-owner">
                Pharmacist {c.owner}
                <br />
                {c.time}
              </span>
            </button>
          ))}
        </div>
        <div className="case-pager" aria-label="Select synthetic case">
          {items.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelected(i)}
              aria-label={"Show " + c.title}
              aria-pressed={selected === i}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="center">
          <TextLink href={"/demo?episode=" + items[selected].id}>
            Open this case in the demo
          </TextLink>
          <p className="small">
            DEMO / SYNTHETIC DATA · CONCEPT PREVIEW · No customer testimonials.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Home({
  navigation,
  onResumeMotion,
}: {
  navigation?: React.ReactNode;
  onResumeMotion?: () => void;
}) {
  const [backdropTarget, setBackdropTarget] = useState<HTMLDivElement | null>(
    null,
  );
  return (
    <>
      <OpeningAtmosphere onTarget={setBackdropTarget} />
      <Intro onResumeMotion={onResumeMotion} backdropTarget={backdropTarget} />
      <div className="home-navigation">{navigation}</div>
      <aside className="funding-announcement" aria-label="Funding announcement">
        <span>Company announcement</span>
        <strong>RxLineage funding announcement</strong>
        <span>Venture partner and funding amount to be announced.</span>
      </aside>
      <section
        id="home-hero"
        tabIndex={-1}
        className="home-hero section"
        data-tone="paper"
      >
        <div className="container hero-grid">
          <div className="hero-copy">
            <Eyebrow>
              For pharmacist-led review / Research-stage concept
            </Eyebrow>
            <h1>
              Let pharmacists see which medication-history discrepancies{" "}
              <em>deserve review.</em>
            </h1>
            <p className="lead">
              A proposed source-attributed workflow for pharmacist review at
              admission and discharge.
            </p>
            <div className="actions">
              <Button href="/request-pilot">Request a scoped pilot</Button>
              <TextLink href="/demo">Explore the synthetic workflow</TextLink>
            </div>
            <p className="concept-note">
              Synthetic concept preview. Not an operating product or clinical
              guidance.
            </p>
          </div>
          <div className="hero-visual opening-visual">
            <HeroEvidenceScene />
          </div>
        </div>
        <a href="#story" className="scroll-invitation">
          <span>Follow the evidence</span>
          <span className="scroll-line" />
          <Icon name="arrow-right" />
        </a>
      </section>
      <div className="reader-rail container">
        <span className="rail-label">A source-attributed story</span>
        <nav aria-label="Story chapters">
          {[
            ["Sources", "#story"],
            ["Uncertainty", "#uncertainty"],
            ["Review", "#review"],
            ["Modules", "#modules"],
            ["Evaluation", "#evaluation"],
          ].map(([n, h]) => (
            <a href={h} key={n}>
              {n}
            </a>
          ))}
        </nav>
        <a href="#modules" className="skip-story">
          Skip to modules <Icon name="skip-forward" />
        </a>
      </div>
      <section
        className="lineage-chapter dark-section section"
        data-tone="dark"
      >
        <ApprovedChapterBackdrop />
        <div className="chapter-orbit" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="container chapter-copy">
          <Eyebrow>One evidence chain / An accountable reader</Eyebrow>
          <h2>
            Two histories.
            <br />
            <em>One accountable review.</em>
          </h2>
          <p>
            In the proposed workflow, sources remain distinct. Their dates,
            differences and uncertainty stay attached—all the way to the
            pharmacist.
          </p>
          <div
            className="lineage-tokens"
            aria-label="Proposed evidence sequence"
          >
            <span>
              <b>01</b>Reported history
            </span>
            <i aria-hidden="true" />
            <span>
              <b>02</b>Dated source
            </span>
            <i aria-hidden="true" />
            <span>
              <b>03</b>Human review
            </span>
          </div>
          <p className="chapter-disclosure">
            Concept preview · No automatic adjudication
          </p>
        </div>
      </section>
      <StorySequence />
      <section
        id="uncertainty"
        className="section uncertainty-section"
        data-tone="lavender"
      >
        <div className="container">
          <SectionTitle
            label="04 / Uncertainty, made explicit"
            title="Missing is different from conflicting."
            center
          >
            Both deserve a clear label. Neither is a clinical conclusion.
          </SectionTitle>
          <div className="uncertainty-pair">
            <article className="uncertainty-card" data-reveal>
              <span className="uncertainty-symbol">
                <Icon name="git-compare" />
              </span>
              <Chip type="conflict">Conflicting</Chip>
              <h3>Two accounts disagree.</h3>
              <p>
                Available sources provide incompatible values. Preserve both
                sources, their dates and the unresolved question.
              </p>
              <div className="mini-sources">
                <span>Reported current</span>
                <span>Different status</span>
              </div>
            </article>
            <article className="uncertainty-card" data-reveal>
              <span className="uncertainty-symbol">
                <Icon name="circle-question-mark" />
              </span>
              <Chip type="unknown">Unknown</Chip>
              <h3>A needed detail is missing.</h3>
              <p>
                The information cannot be established. Show what is absent and
                who owns the next review.
              </p>
              <div className="abstention">
                <Icon name="eye-off" />
                <span>Insufficient evidence, abstaining.</span>
              </div>
            </article>
          </div>
          <p className="center small">
            Every example is synthetic. Confidence is not validated in this
            concept.
          </p>
        </div>
      </section>
      <section
        id="review"
        className="section human-section dark-section"
        data-tone="dark"
      >
        <div className="container split">
          <div data-reveal>
            <Eyebrow>05 / The review boundary</Eyebrow>
            <h2>
              The review stays
              <br />
              <em>with the pharmacist.</em>
            </h2>
            <p className="section-lead">
              Evidence can be arranged. Responsibility cannot be animated away.
            </p>
            <p>
              The reviewer decides what to inspect, which question needs
              clarification and when a disposition can be recorded. Scroll never
              signs off a review.
            </p>
            <TextLink href="/trust">Understand the controls</TextLink>
          </div>
          <div className="review-composition" data-reveal>
            <div className="review-note">
              <DemoBadges />
              <div className="review-owner">
                <span className="avatar">PB</span>
                <div>
                  <strong>Pharmacist Reviewer B</strong>
                  <span>SYN-002 · Review remains unresolved</span>
                </div>
              </div>
              <p className="draft-label">Draft only · not sent</p>
              <blockquote>
                <DraftReveal text="Which source needs clarification before this review can close?" />
              </blockquote>
              <div className="note-boundary">
                <Icon name="lock-keyhole" />
                No send, order change or system write.
              </div>
            </div>
            <div className="signed-strip">
              <div className="review-seal">
                <Icon name="user-round" />
              </div>
              <div>
                <strong>SYN-001 · Review recorded</strong>
                <span>Reviewer A · 12 Oct 2026 · 09:10 UTC</span>
              </div>
              <em>Illustrative human action</em>
            </div>
          </div>
        </div>
      </section>
      <section
        className="section alternatives-section dark-section"
        data-tone="dark"
      >
        <div className="container">
          <SectionTitle
            label="The proposed shift"
            title="From scattered context to an inspectable review."
          />
          <div className="before-after">
            <div>
              <span className="comparison-label">
                Current workflow to investigate
              </span>
              <h3>
                Sources assembled.
                <br />
                Flags considered.
                <br />
                Context found again.
              </h3>
              <ul>
                <li>Incomplete histories and conflicting lists</li>
                <li>Existing pharmacist review and EHR alerts</li>
                <li>Baseline burden not yet measured</li>
              </ul>
            </div>
            <div>
              <span className="comparison-label">
                Proposed workflow to test
              </span>
              <h3>
                Source-attributed.
                <br />
                Uncertainty visible.
                <br />
                Pharmacist-adjudicated.
              </h3>
              <ul>
                <li>Evidence linked to each discrepancy</li>
                <li>Ownership and abstention retained</li>
                <li>Incremental value tested against current triage</li>
              </ul>
            </div>
          </div>
          <p className="small">
            Surescripts and DrFirst already address medication history and
            reconciliation. RxLineage would need to earn its place in that
            workflow.
          </p>
          <TextLink href="/evidence#alternatives">
            Read alternatives and tradeoffs
          </TextLink>
        </div>
      </section>
      <section
        id="modules"
        className="section modules-section"
        data-tone="mist"
      >
        <div className="container">
          <SectionTitle
            label="Five proposed modules"
            title="One workflow. Five clear responsibilities."
          >
            Separate offers to test, connected by the same evidence chain. Start
            with the admission/discharge Review Queue.
          </SectionTitle>
          <ModuleList />
        </div>
      </section>
      <section className="section platform-section" data-tone="paper">
        <div className="container split">
          <div data-reveal>
            <Eyebrow>The shared concept</Eyebrow>
            <h2>
              Follow the lineage.
              <br />
              <em>Find the owner.</em>
            </h2>
            <p className="section-lead">
              A source record becomes part of an episode. A flag carries its
              evidence. A reviewer owns the disposition.
            </p>
            <p>
              The proposed model retains source versions, abstention and
              overrides. Integration rights and input contracts remain discovery
              questions.
            </p>
            <TextLink href="/platform">Inspect the proposed platform</TextLink>
          </div>
          <HeroArt slug="platform" />
        </div>
      </section>
      <section className="section usecase-section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Where to begin"
            title="Start with one transition."
          />
          <div className="usecase-grid">
            {[
              [
                "admission",
                "building",
                "Admission",
                "Inspect the dated accounts behind an arriving medication history.",
                "Initial scope",
              ],
              [
                "discharge",
                "route",
                "Discharge",
                "Make unresolved review and ownership visible in the handoff.",
                "Initial scope",
              ],
              [
                "transitions",
                "git-branch",
                "Beyond the first handoff",
                "Consider ambulatory refill and transitions only after approved access and evidence.",
                "Conditional future scope",
              ],
            ].map(([slug, icon, title, copy, tag], i) => (
              <a
                className="usecase"
                href={"/solutions/" + slug}
                key={slug}
                data-reveal
              >
                <span className="usecase-index">
                  0{i + 1} / {tag}
                </span>
                <div className="institution">
                  <Icon name={icon} />
                  <span />
                  <span />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Icon name="arrow-up-right" />
              </a>
            ))}
          </div>
        </div>
      </section>
      <CaseFan />
      <section
        id="evaluation"
        className="section evidence-section dark-section"
        data-tone="dark"
      >
        <div className="container">
          <div className="split">
            <div data-reveal>
              <Eyebrow>Evidence before expansion</Eyebrow>
              <h2>
                A meaningful result
                <br />
                <em>starts with a baseline.</em>
              </h2>
              <p className="section-lead">
                Reconciliation is an established patient-safety process.
                RxLineage’s performance and buyer economics are not established.
              </p>
              <TextLink href="/evidence">
                See what is known and unknown
              </TextLink>
            </div>
            <div className="metric-ledger">
              <div>
                <span>PRIMARY / PROPOSED</span>
                <h3>Precision at a fixed queue size</h3>
                <p>Pharmacist-adjudicated · Baseline comparison required</p>
                <strong>Not yet measured</strong>
              </div>
              <div>
                <span>GUARDRAILS</span>
                <ul>
                  <li>Missed critical discrepancies</li>
                  <li>False-alert burden</li>
                  <li>Review time</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="stop-rule">
            <Icon name="circle-alert" />
            <p>
              <strong>A real stop rule.</strong> {stopRule}
            </p>
          </div>
          <div className="pilot-gate-preview">
            <span className="gate-big">08</span>
            <p>
              Pharmacist/director interviews required, plus blinded-case
              approval, a champion, a funded silent-mode scope and signed
              approvals.
            </p>
            <TextLink href="/evaluation">Read every prerequisite</TextLink>
          </div>
        </div>
      </section>
      <section className="section price-section" data-tone="mist">
        <div className="container price-strip">
          <div data-reveal>
            <Eyebrow>Commercial hypothesis / not an active offer</Eyebrow>
            <h2>
              A bounded evaluation.
              <br />
              <em>An explicit price hypothesis.</em>
            </h2>
          </div>
          <div>
            <p className="price-number">
              $3,000<span>/ hospital site / month</span>
            </p>
            <p>+ $8,000 evaluation setup</p>
            <p className="small">
              Hypothetical test price. Scope and duration to be agreed. No
              checkout, savings or ROI claim.
            </p>
            <TextLink href="/pricing">Review the hypothesis</TextLink>
          </div>
        </div>
      </section>
      <FAQ />
      <Closing />
    </>
  );
}
