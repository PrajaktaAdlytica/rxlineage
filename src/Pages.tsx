import React from "react";
import {
  PageHero,
  SectionTitle,
  HeroArt,
  ModuleList,
  Closing,
  FAQ,
  Eyebrow,
  Icon,
  TextLink,
  Button,
  Gates,
  DemoBadges,
  Chip,
} from "./components";
import {
  moduleNames,
  moduleSlugs,
  moduleDescriptions,
  stopRule,
  primaryMetric,
  sources,
  gateItems,
} from "./content";
import { Comparison } from "./Home";
const productDetail = [
  {
    desc: "See the source behind each displayed field. Keep reported history and dated pharmacy history side by side, without treating either as complete or authoritative.",
    job: "Put the accounts beside each other.",
    body: "The proposed comparison retains source IDs, observed dates, received dates and field completeness. A reviewer can inspect why the accounts differ before adjudicating a surfaced flag.",
    inputs: [
      "Synthetic home-med / reported list",
      "Dated history extract, with version",
      "Source completeness and authorized fields",
    ],
    steps: [
      "Keep the original source and timestamp.",
      "Separate absent information from disagreement.",
      "Open the evidence without losing the row.",
    ],
    output:
      "An inspectable, unresolved comparison—not a reconciled medication order.",
    guard:
      "Source coverage and confidence are not validated. A newer entry is not automatically true.",
    related: 1,
  },
  {
    desc: "A proposed admission/discharge discrepancy queue that keeps the reviewer, evidence and next action visible. This is the starting module for a bounded pilot.",
    job: "Give each exception an accountable owner.",
    body: "The queue is a work-orchestration hypothesis, not an independent clinical decision-maker. Pharmacists inspect source-attributed cases, retain uncertain items and document a disposition.",
    inputs: [
      "Synthetic reconciliation episode",
      "Source-linked discrepancy flag",
      "Reviewer and next review time",
    ],
    steps: [
      "Inspect an episode and its source evidence.",
      "Retain blocked and abstained cases.",
      "Record a human-attributed disposition.",
    ],
    output:
      "A review queue with explicit ownership, uncertainty and an audit record.",
    guard:
      "Queue composition is synthetic. Prioritization performance and incremental value remain unmeasured.",
    related: 4,
  },
  {
    desc: "Explore duplicate, allergy and dose issue prioritization for pharmacist adjudication. The reason for a flag and the limits of its evidence remain inspectable.",
    job: "Make a flag explainable—and rejectable.",
    body: "A proposed issue lane exposes the reason an item was surfaced, its source references and uncertainty. It must support pharmacist rejection and retain the failure rather than hiding it from evaluation.",
    inputs: [
      "Authorized issue criteria agreed with sponsor",
      "Source-linked candidate flag",
      "Pharmacist reference review",
    ],
    steps: [
      "Expose the rule or evidence behind the issue.",
      "Keep missing information and confidence explicit.",
      "Let a pharmacist reject a flag with a reason.",
    ],
    output:
      "A proposed issue-review order for pharmacist adjudication, never an independent drug-change recommendation.",
    guard:
      "SYN-007 illustrates a rejected duplicate concern: both references describe the same source event. This is not an accuracy result.",
    related: 0,
  },
  {
    desc: "Turn an unresolved source question into a draft for human review. The concept has no send, patient-contact or prescribing action.",
    job: "Draft the question. Keep it unsent.",
    body: "A reviewer should be able to see which uncertainty motivated a question and who would need to review it. This concept shows a draft only; messaging rights and workflows are not implemented.",
    inputs: [
      "An unresolved source discrepancy",
      "The evidence to be clarified",
      "An identified pharmacist reviewer",
    ],
    steps: [
      "Identify the missing or conflicting field.",
      "Draft a question with its evidence context.",
      "Keep the draft unsent for human review.",
    ],
    output:
      "A clarifying-question draft to prescriber/patient, with no external transmission.",
    guard:
      "No outbound messages, patient contact, automatic clinical language or live communications exist.",
    related: 4,
  },
  {
    desc: "Inspect completion, rejection, override and unresolved review states with actor, date, evidence and version. Illustrative reports describe workflow—not clinical benefit.",
    job: "Keep the record open to inspection.",
    body: "The proposed audit model links the episode to source versions, a pharmacist disposition and any later correction. A reversal adds an event; it does not erase the original.",
    inputs: [
      "Episode and source versions",
      "Reviewer events and stated reasons",
      "Retained abstentions and overrides",
    ],
    steps: [
      "Preserve the original evidence references.",
      "Attribute each manual event and timestamp.",
      "Append corrections while retaining prior history.",
    ],
    output:
      "Reconciliation completion and override audit reports, with illustrative fixture counts.",
    guard:
      "Completed means an illustrative review state. It does not mean the history is complete, clinically safe or a medication order changed.",
    related: 1,
  },
];
function ProductPage({ index }: { index: number }) {
  const p = productDetail[index];
  return (
    <>
      <PageHero
        slug={moduleSlugs[index]}
        tag={
          "Proposed module 0" +
          (index + 1) +
          (index === 1 ? " / Initial pilot focus" : "")
        }
        description={p.desc}
      />
      <section className="section" data-tone="mist">
        <div className="container split">
          <div>
            <SectionTitle label="The job it owns" title={p.job}>
              {p.body}
            </SectionTitle>
            <p className="exact-offer">
              <span>Original offer</span>
              {moduleDescriptions[index]}.
            </p>
          </div>
          <div className="input-ledger">
            <Eyebrow>Proposed inputs / discovery required</Eyebrow>
            {p.inputs.map((x, i) => (
              <div key={x}>
                <span>0{i + 1}</span>
                <p>{x}</p>
                <Icon name="corner-up-right" />
              </div>
            ))}
            <p className="small">
              No real source feed or system connection is present.
            </p>
          </div>
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Workflow"
            title="Evidence first. A human at every boundary."
          />
          <ol className="numbered-flow">
            {p.steps.map((s, i) => (
              <li key={s} data-reveal>
                <span>0{i + 1}</span>
                <h3>{s}</h3>
                <Icon name={["file-text", "git-compare", "user-round"][i]} />
              </li>
            ))}
          </ol>
          <div className="output-line">
            <Icon name="route" />
            <p>
              <strong>Proposed output:</strong> {p.output}
            </p>
          </div>
        </div>
      </section>
      <section
        className="section product-detail-section dark-section"
        data-tone="dark"
      >
        <div className="container split">
          <div>
            <Eyebrow>Inspect the concept</Eyebrow>
            <h2>
              {index === 3
                ? "A question, held for review."
                : index === 4
                  ? "A history that retains its history."
                  : "A state worth looking at."}
            </h2>
            <p>{p.guard}</p>
            <p>
              Primary user: a reviewing pharmacist and informatics champion.
              Decision buyer: a health-system pharmacy director or
              medication-safety lead.
            </p>
            <Button
              href={
                "/demo" +
                (index === 2
                  ? "?episode=SYN-007"
                  : index === 4
                    ? "?view=audit"
                    : "?episode=SYN-002")
              }
              light
            >
              Inspect the synthetic example
            </Button>
          </div>
          {index === 0 ? <Comparison /> : <HeroArt slug={moduleSlugs[index]} />}
        </div>
      </section>
      <section className="section" data-tone="mist">
        <div className="container related-grid">
          <div>
            <Eyebrow>Connected responsibility</Eyebrow>
            <h2>{moduleNames[p.related]}</h2>
            <p>{moduleDescriptions[p.related]}.</p>
            <TextLink href={"/products/" + moduleSlugs[p.related]}>
              Explore the related module
            </TextLink>
          </div>
          <div className="boundary-card">
            <Icon name="lock-keyhole" />
            <h3>Evaluate before a live build.</h3>
            <p>
              Input contracts, authorized fields, reviewer roles, exception
              criteria and integration rights must be agreed with the sponsor.
            </p>
            <TextLink href="/evaluation">Review the pilot gates</TextLink>
          </div>
        </div>
      </section>
      <FAQ
        items={[
          [
            "Is this module available today?",
            "No. It is a separate proposed offer under the RxLineage research-stage concept. The website demonstrates synthetic states only.",
          ],
          [
            "How would it fit our current tools?",
            "Through discovery first. The sponsor would need to establish data rights, input contracts and whether this adds value beyond current staff, history services and EHR alerts.",
          ],
          ["What would make you stop?", stopRule],
        ]}
      />
      <Closing />
    </>
  );
}
function Problem() {
  return (
    <>
      <PageHero
        slug="problem"
        description="Incomplete histories and conflicting lists create work for the people reconciling them. Undifferentiated flags can add another review burden."
      />
      <section className="section" data-tone="mist">
        <div className="container">
          <SectionTitle
            label="Start with the current work"
            title="The discrepancy is only part of the job."
          >
            A reviewer also assembles context: which source, which date, what is
            missing and who owns the next step.
          </SectionTitle>
          <div className="editorial-three">
            {[
              [
                "01",
                "Rebuild the context",
                "Sources can be scattered across histories and handoffs. Source completeness must be understood, not assumed.",
              ],
              [
                "02",
                "Interpret the disagreement",
                "A different status may reflect timing, a missing field or conflicting accounts. Recency alone does not settle it.",
              ],
              [
                "03",
                "Carry the unresolved work",
                "Unknowns and rejected flags need an owner and a visible place in the audit record.",
              ],
            ].map(([n, t, c]) => (
              <article data-reveal key={n}>
                <span className="large-index">{n}</span>
                <h3>{t}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
          <a
            className="inline-source"
            href={sources.ahrq}
            target="_blank"
            rel="noreferrer"
          >
            AHRQ describes reconciliation as a patient-safety process{" "}
            <Icon name="external-link" />
          </a>
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container split">
          <div>
            <Eyebrow>The baseline question</Eyebrow>
            <h2>
              What is already
              <br />
              <em>working today?</em>
            </h2>
            <p>
              Pharmacist review, EHR alerts and medication-history services
              already address parts of this workflow. An extra queue must
              justify the time it asks of a reviewer.
            </p>
            <p>
              No baseline workload, switching cost or improvement has been
              measured for RxLineage.
            </p>
            <TextLink href="/evidence#alternatives">
              Compare the alternatives
            </TextLink>
          </div>
          <HeroArt slug="problem" />
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Discovery prompts"
            title="Learn the bottleneck before building around it."
          />
          <ol className="question-ledger">
            <li>Where does your team spend time reassembling evidence?</li>
            <li>
              Which flags repeat information already available in the EHR?
            </li>
            <li>How are unknowns, late sources and rejected flags handled?</li>
            <li>
              What extra review burden would make a new workflow unacceptable?
            </li>
          </ol>
          <TextLink href="/solutions">See the proposed review path</TextLink>
        </div>
      </section>
      <Closing />
    </>
  );
}
function Solutions({ slug = "solutions" }: { slug?: string }) {
  const configs: Record<
    string,
    {
      desc: string;
      label: string;
      title: string;
      body: string;
      steps: string[];
      links: number[];
    }
  > = {
    solutions: {
      desc: "A source-attributed review path for admission and discharge, built around the evidence a pharmacist needs to inspect.",
      label: "A bounded starting point",
      title: "Choose a transition. Keep the boundary.",
      body: "Begin with one workflow and one reviewer group. Retain existing triage as the baseline rather than assuming another queue is valuable.",
      steps: [
        "Compare dated source accounts.",
        "Separate conflict from missing information.",
        "Keep the disposition with a pharmacist.",
      ],
      links: [0, 1],
    },
    admission: {
      desc: "A proposed admission workflow that places reported history beside a dated extract and makes the discrepancy’s source visible.",
      label: "Admission / initial scope",
      title: "Bring the accounts into the same view.",
      body: "SYN-002 arrives with a current reported list and an older history extract. The status differs. Both sources remain visible, and Pharmacist Reviewer B owns the unresolved review.",
      steps: [
        "Receive permitted source artifacts with observed and received times.",
        "Inspect Medication X as a synthetic conflicting field.",
        "Retain the unresolved review and the next action at 10:30 UTC.",
      ],
      links: [0, 1],
    },
    discharge: {
      desc: "A proposed discharge workflow that carries unresolved questions, source dates and reviewer ownership into an inspectable handoff.",
      label: "Discharge / initial scope",
      title: "Make the unresolved handoff visible.",
      body: "A completed review should state what was inspected. An unresolved one should state what is missing and who owns the next review. Neither state implies an order change or clinical clearance.",
      steps: [
        "Inspect which source versions supported the review.",
        "Keep unresolved and abstained cases in the handoff.",
        "Record a human-attributed disposition and its audit history.",
      ],
      links: [1, 4],
    },
    transitions: {
      desc: "Ambulatory refill and transitions are conditional expansion hypotheses, beyond the first admission/discharge evaluation.",
      label: "Conditional future scope",
      title: "Expand after evidence and permission.",
      body: "Do not assume that a workflow validated in one setting transfers to another. A future transitions evaluation would need its own rights, source coverage, baseline, owner and review gate.",
      steps: [
        "Test the initial admission/discharge thesis.",
        "Agree new access rights and context-specific oversight.",
        "Evaluate the additional workflow against its own baseline.",
      ],
      links: [0, 4],
    },
  };
  const c = configs[slug] || configs.solutions;
  return (
    <>
      <PageHero slug={slug} tag={c.label} description={c.desc} />
      <section className="section" data-tone="mist">
        <div className="container split">
          <SectionTitle label={c.label} title={c.title}>
            {c.body}
          </SectionTitle>
          <HeroArt slug={slug} />
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Proposed sequence"
            title="A traceable path, with no automatic action."
          />
          <ol className="numbered-flow">
            {c.steps.map((s, i) => (
              <li key={s} data-reveal>
                <span>0{i + 1}</span>
                <h3>{s}</h3>
                <Icon name={["files", "git-compare", "user-round"][i]} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      {slug === "solutions" && (
        <section className="section" data-tone="paper">
          <div className="container solution-links">
            {["admission", "discharge", "transitions"].map((s, i) => (
              <a href={"/solutions/" + s} key={s}>
                <span>0{i + 1}</span>
                <h3>{configs[s].title}</h3>
                <p>{configs[s].label}</p>
                <Icon name="arrow-up-right" />
              </a>
            ))}
          </div>
        </section>
      )}
      <section className="section dark-section" data-tone="dark">
        <div className="container">
          <SectionTitle
            label="Relevant proposed modules"
            title="Start with the responsibilities you need."
          />
          <div className="related-modules">
            {c.links.map((i) => (
              <a href={"/products/" + moduleSlugs[i]} key={i}>
                <span>0{i + 1}</span>
                <h3>{moduleNames[i]}</h3>
                <p>{moduleDescriptions[i]}.</p>
                <Icon name="arrow-up-right" />
              </a>
            ))}
          </div>
          <p className="small">
            No live systems, dispensing, patient contact or independent
            medication-change recommendations.
          </p>
        </div>
      </section>
      <Closing />
    </>
  );
}
function Platform() {
  const entities = [
    ["Episode", "A synthetic admission/discharge reconciliation context."],
    ["Source record", "Observed date, received date, source ID and version."],
    ["Discrepancy flag", "Reason, source references and uncertainty."],
    ["Reviewer", "An identified fictional pharmacist role and next action."],
    ["Adjudication", "A manual disposition, reason and attributed event."],
    ["Override", "An appended correction with the prior event retained."],
  ];
  return (
    <>
      <PageHero
        slug="platform"
        description="The proposed shared model connects episodes, dated sources, discrepancy flags and human dispositions. Provenance should remain inspectable at every step."
      />
      <section className="section" data-tone="mist">
        <div className="container">
          <SectionTitle
            label="The conceptual object model"
            title="Six objects. No drug-change action."
          />
          <div className="entity-grid">
            {entities.map(([title, body], i) => (
              <article key={title} data-reveal>
                <span className="large-index">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container split">
          <div>
            <Eyebrow>Permission is part of the design</Eyebrow>
            <h2>
              Keep the source.
              <br />
              <em>Respect the boundary.</em>
            </h2>
            <p>
              Source access does not imply the right to ingest, retain or reuse
              it. A future pilot needs agreed input contracts, reviewer roles,
              permission states and exception criteria.
            </p>
            <ul className="check-list">
              <li>Bounded export and integration rights</li>
              <li>Defined retention and correction rules</li>
              <li>Named data, safety and security owners</li>
              <li>Human approval before any external action</li>
            </ul>
            <TextLink href="/trust">Read governance requirements</TextLink>
          </div>
          <HeroArt slug="trust" />
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Five linked responsibilities"
            title="A shared chain, distinct modules."
          />
          <ModuleList />
        </div>
      </section>
      <Closing />
    </>
  );
}
function Evidence() {
  return (
    <>
      <PageHero
        slug="evidence"
        description="Published sources establish the reconciliation workflow and adjacent offerings. They do not establish that RxLineage improves outcomes, sensitivity or economics."
      />
      <section className="section" data-tone="mist">
        <div className="container evidence-columns">
          <div>
            <Eyebrow>Established context</Eyebrow>
            <h2>
              A real workflow.
              <br />
              <em>Existing alternatives.</em>
            </h2>
            <p>
              AHRQ describes medication reconciliation as a patient-safety
              process. Surescripts supplies history for reconciliation; DrFirst
              markets medication-history and reconciliation tooling.
            </p>
            <a
              href={sources.ahrq}
              className="inline-source"
              target="_blank"
              rel="noreferrer"
            >
              Read AHRQ’s workflow context
              <Icon name="external-link" />
            </a>
          </div>
          <div className="unknown-ledger">
            <Eyebrow>RxLineage / not established</Eyebrow>
            {[
              "Model sensitivity and precision",
              "Incremental review value",
              "Buyer economics and willingness to pay",
              "Source coverage and integration feasibility",
              "Clinical outcomes or regulatory status",
            ].map((x) => (
              <div key={x}>
                <span>{x}</span>
                <strong>Not yet established</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="alternatives" className="section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Alternatives & tradeoffs"
            title="Another queue must earn its place."
          />
          <div className="table-wrap">
            <table className="editorial-table">
              <caption>
                Workflow alternatives—not a feature ranking or partnership claim
              </caption>
              <thead>
                <tr>
                  <th>Alternative</th>
                  <th>Role today</th>
                  <th>Question to investigate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Pharmacist review",
                    "Human judgment and accountability",
                    "Where does evidence assembly consume time?",
                  ],
                  [
                    "EHR interaction alerts",
                    "Alerts within existing clinical workflows",
                    "What would another surface add without duplicate work?",
                  ],
                  [
                    "Surescripts history",
                    "History-data offering for reconciliation",
                    "What permitted data and completeness could support a pilot?",
                  ],
                  [
                    "DrFirst tools",
                    "History and AI-assisted reconciliation offering",
                    "Which needs are already served by the incumbent?",
                  ],
                  [
                    "RxLineage concept",
                    "Proposed explainable discrepancy workflow",
                    "Does incremental precision justify pharmacist effort?",
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((c, i) =>
                      i === 0 ? (
                        <th scope="row" key={c}>
                          {c}
                        </th>
                      ) : (
                        <td key={c}>{c}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="source-links">
            <a href={sources.surescripts} target="_blank" rel="noreferrer">
              Surescripts product information <Icon name="external-link" />
            </a>
            <a href={sources.drfirst} target="_blank" rel="noreferrer">
              DrFirst product information <Icon name="external-link" />
            </a>
          </div>
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container">
          <SectionTitle
            label="Evidence to generate"
            title="Measure the workflow before claiming value."
          />
          <div className="metric-grid">
            {[
              ["Primary", "Precision at fixed queue size"],
              ["Guardrail", "Missed critical discrepancies"],
              ["Guardrail", "False-alert burden"],
              ["Guardrail", "Review time"],
            ].map(([tag, t]) => (
              <article key={t}>
                <Eyebrow>{tag}</Eyebrow>
                <h3>{t}</h3>
                <p>Not yet measured</p>
              </article>
            ))}
          </div>
          <div className="stop-rule">
            <Icon name="circle-alert" />
            <p>{stopRule}</p>
          </div>
          <TextLink href="/evaluation">Review the proposed protocol</TextLink>
        </div>
      </section>
      <Closing />
    </>
  );
}
function Evaluation() {
  return (
    <>
      <PageHero
        slug="evaluation"
        description="Begin with pharmacist-led discovery and a blinded retrospective comparison. A funded silent-mode scope follows only after data, security and human-oversight approvals."
      />
      <section className="section" data-tone="mist">
        <div className="container">
          <SectionTitle
            label="Pilot prerequisites / requirements, not achievements"
            title="Five gates before proceeding."
          >
            The first validation audience is pharmacy informatics councils and
            medication-safety committees.
          </SectionTitle>
          <Gates />
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container split">
          <div>
            <Eyebrow>The validation plan</Eyebrow>
            <h2>
              Document the baseline.
              <br />
              <em>Blind the comparison.</em>
            </h2>
            <ol className="quiet-steps">
              <li>
                <span>01</span>Interview buyer, operator and oversight owner
                separately.
              </li>
              <li>
                <span>02</span>Record current triage, cohort, baseline window
                and review-time method.
              </li>
              <li>
                <span>03</span>Validate data rights and the pharmacist reference
                dataset.
              </li>
              <li>
                <span>04</span>Score a blinded retrospective set at the same
                queue capacity.
              </li>
              <li>
                <span>05</span>Agree thresholds, ownership and stop rules before
                silent mode.
              </li>
            </ol>
          </div>
          <div className="protocol-card">
            <Eyebrow>Primary metric</Eyebrow>
            <h3>{primaryMetric}</h3>
            <div className="formula">
              <span>Relevant adjudicated surfaced cases</span>
              <span>÷</span>
              <span>K reviewed cases</span>
            </div>
            <p>
              Fix K, the case/flag unit and relevance criteria in advance.
              Report incomplete adjudications, sample size and uncertainty
              separately.
            </p>
            <p>
              Include cases outside the queue, abstentions and critical
              reference cases when assessing missed discrepancies.
            </p>
          </div>
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container">
          <SectionTitle
            label="Guardrails"
            title="Precision cannot hide the cases left out."
          />
          <div className="metric-grid">
            {[
              [
                "Missed critical cases",
                "Critical reference cases not surfaced in the agreed window; retain a critical-case denominator.",
              ],
              [
                "False-alert burden",
                "Non-relevant flags per agreed episode or reviewer-workload unit.",
              ],
              [
                "Review time",
                "Compare with the baseline using an agreed start/stop method and distribution.",
              ],
              [
                "Supporting coverage",
                "Track abstention, missing sources, unresolved reviews and adjudicator disagreement.",
              ],
            ].map(([t, c]) => (
              <article key={t}>
                <h3>{t}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
          <div className="stop-rule">
            <Icon name="circle-alert" />
            <p>
              <strong>Stop rule:</strong> {stopRule} Record the trigger,
              reviewer, decision and next action.
            </p>
          </div>
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container interview-grid">
          <SectionTitle
            label="Separate conversations"
            title="Ask the people who own each part."
          />
          {[
            [
              "Buyer",
              "What would make the evaluation worth funding? Who approves budget? What would disqualify it?",
            ],
            [
              "Operator & champion",
              "Which sources arrive late or disagree? How do you reject a flag? What extra burden would be unacceptable?",
            ],
            [
              "Oversight owner",
              "Who defines criticality? Which data and security approvals are needed? Which result must stop the evaluation?",
            ],
          ].map(([t, c]) => (
            <article key={t}>
              <Icon name="user-round" />
              <h3>{t}</h3>
              <p>{c}</p>
            </article>
          ))}
        </div>
      </section>
      <Closing />
    </>
  );
}
function Pricing() {
  return (
    <>
      <PageHero
        slug="pricing"
        description="An explicit willingness-to-pay hypothesis for a bounded, pharmacist-led evaluation. No accepted price, active checkout or commercial demand is established."
      />
      <section className="section" data-tone="mist">
        <div className="container pricing-layout">
          <div className="pricing-card">
            <Eyebrow>Hypothetical test price / not an active offer</Eyebrow>
            <h2>Site-based evaluation</h2>
            <p className="price-number">
              $3,000<span>per hospital site / month</span>
            </p>
            <div className="setup-price">
              + $8,000 <span>evaluation setup</span>
            </div>
            <hr />
            <p>
              Initial proposed focus: Source-attributed admission/discharge
              discrepancy queue for pharmacist adjudication.
            </p>
            <Button href="/request-pilot">Discuss a scoped evaluation</Button>
            <p className="small">
              No payment collection. Duration, included scope, renewal and
              commercial terms remain to be agreed.
            </p>
          </div>
          <div>
            <SectionTitle
              label="What the discussion must resolve"
              title="Scope before subscription."
            />
            <ul className="scope-list">
              <li>
                <Icon name="clipboard-list" />
                <div>
                  <h3>Written scope and accountable owner</h3>
                  <p>
                    Agree the first workflow, named reviewer group and review
                    gates.
                  </p>
                </div>
              </li>
              <li>
                <Icon name="files" />
                <div>
                  <h3>Authorized data and onboarding</h3>
                  <p>
                    Validate source rights, input fields, reference data and
                    repeatable setup.
                  </p>
                </div>
              </li>
              <li>
                <Icon name="git-compare" />
                <div>
                  <h3>A prespecified comparison</h3>
                  <p>
                    Baseline, fixed queue size, guardrails, uncertainty and an
                    explicit stop rule.
                  </p>
                </div>
              </li>
            </ul>
            <p className="marginal-note">
              No reimbursement, clinical-outcome, error-savings or ROI claim.
            </p>
          </div>
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container split">
          <div>
            <Eyebrow>The commercial hypothesis</Eyebrow>
            <h2>
              Prove one workflow.
              <br />
              <em>Then discuss expansion.</em>
            </h2>
            <p>
              Revenue could follow approved sites, users or workflow volume if
              access, differentiation and onboarding hold. Ambulatory refill and
              transitions remain conditional future scope.
            </p>
            <p>
              No invented TAM, revenue projection or medication-error savings is
              part of this offer.
            </p>
          </div>
          <div>
            <Eyebrow>Before a limited pilot</Eyebrow>
            <ul className="check-list">
              {gateItems.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <TextLink href="/evaluation">See the evaluation gates</TextLink>
          </div>
        </div>
      </section>
      <FAQ
        items={[
          [
            "Is this a current subscription offer?",
            "No. The numbers test willingness to pay. No pricing acceptance, paid customer or active checkout has been demonstrated.",
          ],
          [
            "What is included in setup?",
            "That must be specified in the written pilot scope. Input contracts, permitted data, reference review, owner and security/data-use approvals must be agreed before any evaluation.",
          ],
          ["What if the proposed workflow adds burden?", stopRule],
        ]}
      />
      <Closing />
    </>
  );
}
function Trust() {
  return (
    <>
      <PageHero
        slug="trust"
        description="A future evaluation needs explicit data rights, source provenance, human ownership and specialist safety review. These are requirements, not certifications or completed controls."
      />
      <section className="section" data-tone="mist">
        <div className="container">
          <SectionTitle
            label="The current boundary"
            title="Synthetic. Read-only. Human-accountable."
          />
          <div className="boundary-columns">
            <div>
              <h3>This website contains</h3>
              <ul className="check-list">
                <li>Fictional episodes and source records</li>
                <li>Local, reversible demonstration controls</li>
                <li>Clearly unsent clarification drafts</li>
                <li>Illustrative audit reports with provenance</li>
              </ul>
            </div>
            <div>
              <h3>This website has no</h3>
              <ul className="check-list">
                <li>PHI, real patient records or imports</li>
                <li>Clinical recommendations or order changes</li>
                <li>Live EHR/pharmacy connections</li>
                <li>Patient contact or outbound messages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container">
          <SectionTitle
            label="Accountability"
            title="Define who owns the decision."
          />
          <div className="table-wrap">
            <table className="editorial-table">
              <caption>
                Proposed responsibilities to agree with a pilot sponsor
              </caption>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Responsibility to establish</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Pharmacy director / medication-safety lead",
                    "Scope, budget, current baseline and decision gate.",
                  ],
                  [
                    "Pharmacist informatics champion",
                    "Workflow, data interpretation and co-owned review.",
                  ],
                  [
                    "Reviewing pharmacist",
                    "Reference adjudication, disagreement and attributed dispositions.",
                  ],
                  [
                    "Data / security owner",
                    "Export rights, access, retention, permitted fields and security review.",
                  ],
                  [
                    "Safety / compliance specialist",
                    "Intended use, liability, criticality and regulatory classification review.",
                  ],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <th scope="row">{a}</th>
                    <td>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container split">
          <div>
            <Eyebrow>Before real data</Eyebrow>
            <h2>
              Agree the contract.
              <br />
              <em>Not just the connection.</em>
            </h2>
            <p>
              Validate integration rights and reference datasets. Specify
              permission states, versioning, exception criteria, retention,
              escalation and the response to missed critical cases.
            </p>
            <p>
              Specialist review is required to assess patient-safety, liability
              and any FDA clinical decision support classification questions.
              This website does not establish a regulatory status.
            </p>
            <a
              className="inline-source"
              href={sources.fda}
              target="_blank"
              rel="noreferrer"
            >
              FDA clinical decision support guidance
              <Icon name="external-link" />
            </a>
          </div>
          <HeroArt slug="trust" />
        </div>
      </section>
      <FAQ />
      <Closing />
    </>
  );
}
const articles = [
  {
    slug: "reconciliation",
    hero: "resource-reconciliation",
    category: "Workflow primer",
    title: "The work behind reconciliation",
    summary:
      "Why source dates, completeness and human review belong in the same conversation.",
    sections: [
      [
        "Start with the existing process",
        "AHRQ describes medication reconciliation as a process for identifying an accurate medication list and comparing it across transitions. Its toolkit offers workflow context; it is not evidence that a new model improves care.",
      ],
      [
        "The source is part of the evidence",
        "A history feed, reported list and recorded handoff can cover different moments and have different gaps. Source-attributed review should retain both the observed time and the time an artifact was received. Treating those timestamps as interchangeable can hide a delayed or older account.",
      ],
      [
        "The proposed review surface",
        "RxLineage’s synthetic example compares Medication X across two accounts. One says reported current; an older source records a different status. The interface labels the disagreement and leaves the case unresolved. It does not determine which account is correct.",
      ],
      [
        "A workflow question before a build",
        "Ask where staff currently assemble context, what current triage does well, and which new review burden would be unacceptable. Any evaluation needs a pharmacist champion, rights to its reference data and a meaningful comparison with the current process.",
      ],
    ],
  },
  {
    slug: "uncertainty",
    hero: "resource-uncertainty",
    category: "Reading evidence",
    title: "Unknown and conflicting are different states",
    summary:
      "A missing field and a disagreement require different explanations, not the same warning.",
    sections: [
      [
        "Unknown: the needed information is absent",
        "An unknown field cannot be established from the available sources. The useful response is to show what is missing, the source completeness and the person responsible for review. A blank field must not become an invented answer.",
      ],
      [
        "Conflicting: the available accounts disagree",
        "A conflict means the sources provide incompatible values. It does not establish that either source is wrong or that the newer one is true. Keep source IDs and dates attached to the displayed values.",
      ],
      [
        "Abstention must remain visible",
        "SYN-003 illustrates insufficient evidence to prioritize an item. It stays blocked/abstained, with a reviewer and next-review time. It remains in the report rather than being removed to make queue quality appear better.",
      ],
      [
        "Confidence needs validation",
        "This concept uses “Confidence: not validated” instead of a fabricated probability. Source completeness and model confidence are different. A later evaluation must account for abstentions, missing sources and unresolved adjudications when interpreting results.",
      ],
    ],
  },
  {
    slug: "evaluation-method",
    hero: "resource-evaluation",
    category: "Evaluation method",
    title: "Define the denominator before the result",
    summary:
      "A fixed queue, a blinded reference review and guardrails that include cases outside the queue.",
    sections: [
      [
        "Fix the unit and the queue size",
        "Specify whether the primary unit is an episode or a flag. Agree K, the number of surfaced cases for pharmacist review, and the relevance criteria before scoring. Precision among K cases cannot alone establish sensitivity or clinical benefit.",
      ],
      [
        "Compare with the current process",
        "Use an agreed retrospective cohort and baseline window. Pharmacists should score a blinded set of documented discrepancies against current triage at the same queue capacity. Record incomplete adjudications and disagreements.",
      ],
      [
        "Look beyond what was surfaced",
        "Assess critical reference cases missed in the review window, including cases outside the queue and abstentions. Track false-alert burden, review time, missing-source rate and unresolved reviews. Report sample size and uncertainty.",
      ],
      [
        "Make the stop rule operational",
        stopRule +
          " Agree the owner, review gate and response before the evaluation. A synthetic demo is not evidence of pilot readiness, clinical benefit or regulatory compliance.",
      ],
    ],
  },
];
function Resources({ article }: { article?: string }) {
  const a = articles.find((x) => x.slug === article);
  if (a)
    return (
      <>
        <PageHero
          slug={a.hero}
          tag={a.category + " / Original explainer"}
          description={a.summary}
          cta={false}
        />
        <section className="section article-section" data-tone="paper">
          <div className="container article-layout">
            <aside>
              <Eyebrow>In this explainer</Eyebrow>
              <nav aria-label="Article contents">
                {a.sections.map(([t], i) => (
                  <a href={"#article-" + i} key={t}>
                    {t}
                  </a>
                ))}
              </nav>
              <TextLink href="/resources">All resources</TextLink>
            </aside>
            <article>
              <Eyebrow>Research-stage perspective · 5 minute read</Eyebrow>
              <h2>{a.title}</h2>
              <p className="article-intro">{a.summary}</p>
              {a.sections.map(([t, c], i) => (
                <section id={"article-" + i} key={t}>
                  <h3>{t}</h3>
                  <p>{c}</p>
                </section>
              ))}
              <div className="article-sources">
                <h3>Sources and boundaries</h3>
                <p>
                  Original explanatory copy. Clinical advice is outside scope.
                  Product behavior shown elsewhere is synthetic and unvalidated.
                </p>
                <a href={sources.ahrq} target="_blank" rel="noreferrer">
                  AHRQ MATCH toolkit <Icon name="external-link" />
                </a>
                <a href={sources.fda} target="_blank" rel="noreferrer">
                  FDA CDS guidance <Icon name="external-link" />
                </a>
                <TextLink href="/evidence">Evidence and limitations</TextLink>
              </div>
            </article>
          </div>
        </section>
        <Closing />
      </>
    );
  return (
    <>
      <PageHero
        slug="resources"
        description="Original explainers about source-attributed review, uncertainty and a governed evaluation. These are workflow resources, not clinical guidance."
      />
      <section className="section" data-tone="mist">
        <div className="container resource-grid">
          {articles.map((a, i) => (
            <a
              className="resource-card"
              href={"/resources/" + a.slug}
              key={a.slug}
              data-reveal
            >
              <span className="resource-number">0{i + 1}</span>
              <HeroArt slug={a.hero} />
              <Eyebrow>{a.category}</Eyebrow>
              <h2>{a.title}</h2>
              <p>{a.summary}</p>
              <span className="text-link">
                Read the explainer
                <Icon name="arrow-up-right" />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container split">
          <SectionTitle
            label="For the evaluation conversation"
            title="Bring a workflow, not a patient record."
          >
            Use the resources to prepare questions about source coverage,
            reviewer effort and oversight. Do not enter patient or clinical
            details into this website.
          </SectionTitle>
          <div>
            <TextLink href="/evaluation">Read the pilot protocol</TextLink>
            <br />
            <TextLink href="/request-demo">
              Prepare a walkthrough inquiry
            </TextLink>
          </div>
        </div>
      </section>
      <Closing />
    </>
  );
}
function About() {
  return (
    <>
      <PageHero
        slug="about"
        description="RxLineage is a research-stage concept exploring a human-accountable layer for medication-history discrepancy review. The working brand is provisional."
      />
      <section className="section" data-tone="mist">
        <div className="container manifesto">
          <Eyebrow>The thesis</Eyebrow>
          <h2>
            Make the exception,
            <br />
            the source and the owner
            <br />
            <em>traceable.</em>
          </h2>
          <p className="lead">
            Expand only after permission and measurable operational gain are
            demonstrated.
          </p>
        </div>
      </section>
      <section className="section" data-tone="paper">
        <div className="container editorial-three">
          {[
            [
              "Mission",
              "Start with a source-attributed admission/discharge discrepancy queue for pharmacist adjudication. No medication-change recommendations.",
            ],
            [
              "Audience",
              "Health-system pharmacy directors and medication-safety leads, with pharmacist informatics champions co-owning review.",
            ],
            [
              "Approach",
              "Listen to the current workflow, test a blinded reference set and agree a bounded paid silent-mode scope only after approvals.",
            ],
          ].map(([t, b]) => (
            <article key={t} data-reveal>
              <Icon name="book-open" />
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section dark-section" data-tone="dark">
        <div className="container split">
          <div>
            <Eyebrow>Stage, stated clearly</Eyebrow>
            <h2>
              A concept to test.
              <br />
              <em>Not a result to claim.</em>
            </h2>
            <p>
              No adoption, revenue, efficacy, accepted pricing or live
              integration is established. The demo uses fictional records. Team,
              customer and investor profiles are not invented to make the
              company look mature.
            </p>
            <TextLink href="/contact">
              Bring an organizational question
            </TextLink>
          </div>
          <HeroArt slug="about" />
        </div>
      </section>
      <Closing />
    </>
  );
}
function Legal({ kind }: { kind: string }) {
  const privacy = kind === "privacy",
    access = kind === "accessibility";
  const title = access
    ? "Accessibility statement"
    : privacy
      ? "Privacy notice"
      : "Concept preview terms";
  const sections = access
    ? [
        [
          "What this site supports",
          "Native scrolling, keyboard navigation, visible focus states, labeled controls, responsive layouts, motion pause and reduced-motion handling. Essential workflow states have text labels rather than color alone.",
        ],
        [
          "Motion and reading",
          "Use the Pause motion control, or your operating system’s reduced-motion setting. The source story can be skipped through chapter links. Diagrams retain complete still states; no reviewer decision depends on an animation.",
        ],
        [
          "Demonstration controls",
          "Episode selection, filters and evidence controls use real buttons and labeled fields. Mobile sources stack for reading. Synthetic reports also have a structured text/JSON download.",
        ],
        [
          "Known limits and feedback",
          "This implementation has been reviewed at representative desktop and mobile sizes; it has not undergone a complete assistive-technology audit or received a conformance certification. To describe a barrier, prepare a general organizational contact draft without personal clinical information.",
        ],
      ]
    : privacy
      ? [
          [
            "Status and scope",
            "Draft notice for this concept website, dated 17 October 2026. A business owner and production collection policy must be approved before activating a real inquiry service.",
          ],
          [
            "What the application does",
            "The inquiry forms validate organizational context in your browser and can produce a local download or clipboard draft. They do not submit that context to a server. The demo contains fictional records and its interactions reset when the page is reloaded.",
          ],
          [
            "What not to enter",
            "Do not enter patient names, histories, clinical details, credentials or uploaded records. No patient record upload or import is provided.",
          ],
          [
            "Storage, analytics and hosting",
            "The application sets no analytics cookies and uses no personal-data analytics or browser persistence. The hosting service may process connection metadata to serve the website under its own terms. Third-party source links open their respective sites and their notices apply there.",
          ],
          [
            "Consent and draft files",
            "The checkbox acknowledges the draft-only behavior. Prepared draft exports contain the information you entered, the draft notice version and a preparation timestamp. They remain under your control; the application does not transmit them or automatically retain them.",
          ],
          [
            "Deletion and contact",
            "Clear the form or reload to remove entries from the live page; delete downloaded drafts using your device’s file controls. This application has no submitted inquiry record to delete. A general contact draft is available, but no delivery destination is connected. A verified privacy contact and retention policy are prerequisites to real collection.",
          ],
        ]
      : [
          [
            "Purpose",
            "Draft terms for a research-stage website and isolated synthetic demonstration. These terms do not create a clinical service, pilot contract, subscription or professional relationship.",
          ],
          [
            "No clinical use",
            "The content is not diagnosis, treatment, prescribing, medication-change advice or patient-specific guidance. Do not use the synthetic records or proposed prioritization as clinical determinations.",
          ],
          [
            "Availability and pricing",
            "No operating product, live integration or customer portal is represented. Proposed modules may change after validation. The $3,000/site/month plus $8,000 setup price is hypothetical, not a current offer or accepted market price.",
          ],
          [
            "Data and communications",
            "Do not provide patient information or sensitive records. Draft controls do not send messages, change orders, contact patients or write to external systems. A future evaluation requires its own written scope, approvals and legal terms.",
          ],
          [
            "Intellectual property and sources",
            "RxLineage is a working brand and trademark clearance is not established. Third-party marks and linked sources belong to their owners; inclusion does not imply endorsement or partnership. Font and icon license notices are retained in the source package.",
          ],
          [
            "Further review",
            "These draft terms need legal and business-owner review before any public operating service, data collection or commercial agreement. Questions can be prepared through the contact-draft page.",
          ],
        ];
  return (
    <>
      <PageHero
        slug={kind}
        tag={
          access
            ? "Usability / implementation statement"
            : "Draft notice / review required"
        }
        description={
          access
            ? "A readable workflow should remain usable with touch, keyboard and motion disabled."
            : "The boundaries of a research-stage website and synthetic browser-local demonstration."
        }
        cta={false}
      />
      <section className="section article-section" data-tone="paper">
        <div className="container legal-layout">
          <aside>
            <Eyebrow>{title}</Eyebrow>
            <p>Updated 17 October 2026</p>
            <TextLink href="/contact">Prepare a contact draft</TextLink>
          </aside>
          <article>
            {sections.map(([t, c]) => (
              <section key={t}>
                <h2>{t}</h2>
                <p>{c}</p>
              </section>
            ))}
            <div className="notice">
              <Icon name="circle-alert" />
              <p>
                {access
                  ? "No blanket accessibility certification is claimed."
                  : "Draft status is explicit. No collection service or clinical product is activated by these pages."}
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
export function NotFound() {
  return (
    <>
      <PageHero
        slug="404"
        tag="404 / This path is not in the folio"
        description="The page may have moved, or the address may be incomplete. There is still a useful next step."
        cta={false}
      />
      <section className="section" data-tone="mist">
        <div className="container center">
          <h2>Pick up the thread.</h2>
          <div className="actions center">
            <Button href="/">Return home</Button>
            <Button href="/products" secondary>
              Explore proposed modules
            </Button>
            <TextLink href="/contact">Contact</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
export function ContentPage({ path }: { path: string }) {
  if (path === "/problem") return <Problem />;
  if (path === "/products")
    return (
      <>
        <PageHero
          slug="products"
          description="Five separate proposed offers, held together by the same source-linked evidence and pharmacist accountability. The Review Queue is the initial pilot focus."
        />
        <section className="section" data-tone="mist">
          <div className="container">
            <SectionTitle
              label="Product inventory / exact original scope"
              title="Find the responsibility your workflow needs."
            />
            <ModuleList />
          </div>
        </section>
        <section className="section dark-section" data-tone="dark">
          <div className="container split">
            <SectionTitle
              label="Shared foundation"
              title="One traceable evidence chain."
            >
              Every proposed module retains a source, uncertainty state, owner
              and review boundary. There is no automated medication-change
              action.
            </SectionTitle>
            <HeroArt slug="platform" />
          </div>
          <div className="container">
            <TextLink href="/platform">Explore the proposed platform</TextLink>
          </div>
        </section>
        <Closing />
      </>
    );
  const idx = moduleSlugs.findIndex((s) => path === "/products/" + s);
  if (idx >= 0) return <ProductPage index={idx} />;
  if (path === "/solutions" || path.startsWith("/solutions/"))
    return <Solutions slug={path.split("/")[2] || "solutions"} />;
  if (path === "/platform") return <Platform />;
  if (path === "/evidence") return <Evidence />;
  if (path === "/evaluation") return <Evaluation />;
  if (path === "/pricing") return <Pricing />;
  if (path === "/trust") return <Trust />;
  if (path === "/about") return <About />;
  if (path === "/resources" || path.startsWith("/resources/"))
    return <Resources article={path.split("/")[2]} />;
  if (path.startsWith("/legal/")) return <Legal kind={path.split("/")[2]} />;
  if (path === "/accessibility") return <Legal kind="accessibility" />;
  return <NotFound />;
}
