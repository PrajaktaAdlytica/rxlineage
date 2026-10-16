import React, { useEffect, useRef, useState } from "react";
import {
  PageHero,
  Icon,
  DemoBadges,
  Chip,
  TextLink,
  Eyebrow,
} from "./components";
import { episodes, stateLabels, date, Episode } from "./content";
type Event = {
  at: string;
  actor: string;
  action: string;
  reason: string;
  version: number;
};
function eventsFor(e: Episode): Event[] {
  return [
    {
      at: e.intakeAt,
      actor: "Synthetic intake",
      action: "Source artifacts received",
      reason: "Fictional artifacts only; no live feed.",
      version: 1,
    },
    {
      at: e.assignedAt,
      actor: e.owner,
      action: "Reviewer assigned",
      reason: "Human review ownership established in fixture.",
      version: 1,
    },
    ...(e.reviewedAt
      ? [
          {
            at: e.reviewedAt,
            actor: e.owner,
            action:
              e.state === "rejected-flag" ? "Flag rejected" : "Review recorded",
            reason: e.reason,
            version: 1,
          },
        ]
      : [
          {
            at: new Date(+new Date(e.assignedAt) + 60000).toISOString(),
            actor: e.owner,
            action:
              e.state === "blocked-abstained"
                ? "Abstained"
                : e.state === "in-review"
                  ? "Review opened"
                  : "Pending review",
            reason: e.reason,
            version: 1,
          },
        ]),
  ];
}
export function Demo() {
  const [selected, setSelected] = useState("SYN-002"),
    [tab, setTab] = useState("sources"),
    [filter, setFilter] = useState("all"),
    [query, setQuery] = useState(""),
    [drawer, setDrawer] = useState(false),
    [source, setSource] = useState(0),
    [unavailable, setUnavailable] = useState(false),
    [feedback, setFeedback] = useState(""),
    [local, setLocal] = useState<Record<string, Event[]>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const recordRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (episodes.some((e) => e.id === q.get("episode")))
      setSelected(q.get("episode")!);
    if (q.get("view") === "audit") setTab("audit");
  }, []);
  useEffect(() => {
    if (drawer) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [drawer]);
  const current = episodes.find((e) => e.id === selected)!;
  const unknown = current.state === "blocked-abstained";
  const conflict = selected === "SYN-002";
  const localEvents = local[selected] || [];
  const history = [...eventsFor(current), ...localEvents];
  const filtered = episodes.filter(
    (e) =>
      (filter === "all" || e.state === filter) &&
      (e.id + " " + e.owner + " " + stateLabels[e.state])
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pick = (id: string) => {
    setSelected(id);
    setTab("sources");
    setUnavailable(false);
    setFeedback("");
    if (innerWidth < 900)
      requestAnimationFrame(() =>
        recordRef.current?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        }),
      );
  };
  const event = (action: string, reason: string) => {
    const entry = {
      at: new Date(
        Date.UTC(2026, 9, 12, 9, 30 + localEvents.length),
      ).toISOString(),
      actor: current.owner,
      action,
      reason,
      version: localEvents.length + 2,
    };
    setLocal((v) => ({ ...v, [selected]: [...localEvents, entry] }));
    setFeedback(
      action +
        ". Local illustrative event only. No system write, order change or message.",
    );
  };
  const exportRecord = () => {
    const payload = {
      watermark: "DEMO / SYNTHETIC DATA — CONCEPT PREVIEW",
      scope:
        "Illustrative local report; no clinical guidance or system connection",
      episode: current,
      sourceIds: ["A", "B"].map((s) => "SRC-" + selected.slice(4) + s),
      confidence: "Not validated",
      history,
    };
    const a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json",
        }),
      );
    a.href = url;
    a.download = selected + "-synthetic-audit.json";
    a.click();
    URL.revokeObjectURL(url);
    setFeedback("Synthetic report downloaded locally. Nothing transmitted.");
  };
  const sourceId = "SRC-" + selected.slice(4) + (source === 0 ? "A" : "B");
  const sourceObserved = current.sourceObservedAt[source];
  return (
    <>
      <PageHero
        slug="demo"
        jump={["Jump to the synthetic queue", "#episodes"]}
        tag="Isolated concept demonstration"
        cta={false}
        description="Inspect nine fictional episodes, compare sources and trace a human review. Everything runs locally in your browser; no records or actions reach a clinical system."
      />
      <section id="workbench" className="section demo-section" data-tone="mist">
        <div className="container wide">
          <div className="demo-intro">
            <div>
              <Eyebrow>Concept workbench / Fictional UTC timestamps</Eyebrow>
              <h2>Review the evidence.</h2>
            </div>
            <DemoBadges />
          </div>
          <div className="fixture-stats" aria-label="Synthetic fixture counts">
            <div>
              <strong>9</strong>
              <span>episodes</span>
            </div>
            {[
              ["3", "Pending"],
              ["1", "In review"],
              ["2", "Abstained"],
              ["2", "Completed"],
              ["1", "Flag rejected"],
            ].map(([n, t]) => (
              <div key={t}>
                <strong>{n}</strong>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <p className="small fixture-note">
            Fixed fixture counts, not measured performance or live telemetry.
            Local annotations do not change this reference cohort.
          </p>
          <div className="workbench" id="episodes">
            <aside className="queue-panel">
              <div className="queue-title">
                <h3>Episode queue</h3>
                <span>9 / synthetic</span>
              </div>
              <div className="queue-filters">
                <label htmlFor="episode-search">Find an episode</label>
                <div className="search-wrap">
                  <Icon name="search" />
                  <input
                    id="episode-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ID, reviewer or state"
                  />
                </div>
                <label htmlFor="episode-state">Review state</label>
                <select
                  id="episode-state"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All states</option>
                  {Object.entries(stateLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <p className="queue-count" aria-live="polite">
                {filtered.length} of 9 episodes shown
              </p>
              <div className="queue-list">
                {filtered.map((e) => (
                  <button
                    key={e.id}
                    className={
                      "queue-item " + (selected === e.id ? "selected" : "")
                    }
                    aria-pressed={selected === e.id}
                    onClick={() => pick(e.id)}
                  >
                    <div>
                      <strong>{e.id}</strong>
                      <Icon name="arrow-up-right" />
                    </div>
                    <span className={"queue-state " + e.state}>
                      {stateLabels[e.state]}
                    </span>
                    <small>
                      {e.owner}
                      <br />
                      {e.nextReviewAt
                        ? "Next " + date(e.nextReviewAt)
                        : "Reviewed " + date(e.reviewedAt!)}
                    </small>
                  </button>
                ))}
                {!filtered.length && (
                  <div className="empty-state">
                    <Icon name="search" />
                    <h4>No matching episodes.</h4>
                    <p>Try a source ID, reviewer or another state.</p>
                    <button
                      onClick={() => {
                        setFilter("all");
                        setQuery("");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </aside>
            <article
              ref={recordRef}
              className="record-panel"
              aria-label={"Selected episode " + selected}
            >
              <div className="record-heading">
                <div>
                  <span className="mono">RECONCILIATION EPISODE</span>
                  <h3>{selected}</h3>
                </div>
                <Chip
                  type={
                    unknown
                      ? "unknown"
                      : conflict
                        ? "conflict"
                        : current.state === "completed"
                          ? "recorded"
                          : "neutral"
                  }
                >
                  {unknown
                    ? "Unknown / Abstained"
                    : conflict
                      ? "Conflicting"
                      : stateLabels[current.state]}
                </Chip>
              </div>
              <DemoBadges />
              <div className="record-owner">
                <span>
                  <Icon name="user-round" />
                  {current.owner}
                </span>
                <span>
                  <Icon name="clock" />
                  {current.nextReviewAt
                    ? "Next " + date(current.nextReviewAt)
                    : "Reviewed " + date(current.reviewedAt!)}
                </span>
              </div>
              <nav className="record-tabs" aria-label="Episode views">
                {[
                  ["sources", "Sources"],
                  ["review", "Pharmacist review"],
                  ["audit", "Audit report"],
                ].map(([t, n]) => (
                  <button
                    key={t}
                    aria-pressed={tab === t}
                    onClick={() => setTab(t)}
                  >
                    {n}
                  </button>
                ))}
              </nav>
              {unknown && (
                <div className="abstention-banner">
                  <Icon name="eye-off" />
                  <div>
                    <strong>Insufficient evidence, abstaining.</strong>
                    <p>
                      A needed detail is missing. This case remains blocked,
                      with a reviewer and next action.
                    </p>
                  </div>
                </div>
              )}
              {tab === "sources" && (
                <>
                  <div className="source-detail-grid">
                    {[0, 1].map((i) => (
                      <article className="record-source" key={i}>
                        <Eyebrow>Source {i === 0 ? "A" : "B"}</Eyebrow>
                        <h4>
                          {i === 0
                            ? "Reported history"
                            : "Dated history extract"}
                        </h4>
                        <p className="mono">
                          SRC-{selected.slice(4)}
                          {i === 0 ? "A" : "B"}
                        </p>
                        <dl>
                          <dt>Observed</dt>
                          <dd>{date(current.sourceObservedAt[i])}</dd>
                          <dt>Received</dt>
                          <dd>{date(current.intakeAt)}</dd>
                          <dt>Medication</dt>
                          <dd>Medication X</dd>
                          <dt>Recorded status</dt>
                          <dd
                            className={
                              unknown
                                ? "unknown-value"
                                : conflict
                                  ? "conflict-value"
                                  : ""
                            }
                          >
                            {unknown
                              ? "Required detail missing"
                              : conflict
                                ? i === 0
                                  ? "Reported current"
                                  : "Different recorded status"
                                : "Displayed fields agree"}
                          </dd>
                          <dt>Confidence</dt>
                          <dd>Not validated</dd>
                        </dl>
                        <button
                          className="text-link"
                          onClick={() => {
                            setSource(i);
                            setDrawer(true);
                          }}
                        >
                          Inspect source evidence
                          <Icon name="panel-right-open" />
                        </button>
                      </article>
                    ))}
                  </div>
                  <div className="source-reading-note">
                    <Icon name="circle-alert" />
                    <p>
                      {current.reason}{" "}
                      {conflict
                        ? "Neither source is treated as the correct account."
                        : ""}
                    </p>
                  </div>
                  <button
                    className="source-state-toggle"
                    aria-pressed={unavailable}
                    onClick={() => setUnavailable(!unavailable)}
                  >
                    {unavailable
                      ? "Restore source preview"
                      : "Show unavailable-source example"}
                  </button>
                  {unavailable && (
                    <div className="notice unknown">
                      <Icon name="eye-off" />
                      <p>
                        Source preview unavailable in this illustrative state.
                        The source ID, timestamp and unresolved review remain
                        visible. No conclusion is inferred.
                      </p>
                    </div>
                  )}
                </>
              )}
              {tab === "review" && (
                <div className="review-content">
                  <Eyebrow>Explicit human boundary</Eyebrow>
                  <h4>
                    {unknown
                      ? "An abstention is a visible state."
                      : "The reviewer owns the disposition."}
                  </h4>
                  <p>{current.reason}</p>
                  {conflict && (
                    <div className="unsent-draft">
                      <span>Draft only · not sent</span>
                      <p>
                        Which source needs clarification before this review can
                        close?
                      </p>
                      <small>
                        No outbound messaging or patient-contact control.
                      </small>
                    </div>
                  )}
                  <dl className="review-definition">
                    <dt>Reviewer assigned</dt>
                    <dd>{date(current.assignedAt)}</dd>
                    <dt>State</dt>
                    <dd>{stateLabels[current.state]}</dd>
                    <dt>Clinical action</dt>
                    <dd>None. No diagnosis, treatment or order change.</dd>
                  </dl>
                  <div className="manual-controls">
                    {selected === "SYN-001" ? (
                      <>
                        <button
                          className="button shutter"
                          onClick={() =>
                            event(
                              "Illustrative review annotation recorded",
                              "Displayed source fields agree. Fictional manual annotation only.",
                            )
                          }
                        >
                          <span>Record illustrative review</span>
                          <Icon name="user-round" />
                        </button>
                        {localEvents.length > 0 && (
                          <button
                            className="text-link"
                            onClick={() =>
                              event(
                                "Prior local annotation reversed",
                                "Reversal appended; earlier version retained for inspection.",
                              )
                            }
                          >
                            Append reversal
                            <Icon name="rotate-ccw" />
                          </button>
                        )}
                      </>
                    ) : selected === "SYN-002" ? (
                      <button
                        className="button secondary"
                        onClick={() =>
                          event(
                            "Kept unresolved",
                            "Conflicting source accounts require clarification. Draft remains unsent.",
                          )
                        }
                      >
                        <span>Keep unresolved — local example</span>
                        <Icon name="lock-keyhole" />
                      </button>
                    ) : (
                      <div className="notice">
                        <Icon name={unknown ? "eye-off" : "user-round"} />
                        <p>
                          {unknown
                            ? "No record-review action is available for this abstained example."
                            : "This reference fixture is read-only. Inspect its attributed disposition in the audit report."}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="small">
                    Manual demonstrations add local fictional events only.
                    Reload resets them.
                  </p>
                </div>
              )}
              {tab === "audit" && (
                <div className="audit-content">
                  <Eyebrow>
                    Illustrative report / Not operational telemetry
                  </Eyebrow>
                  <h4>Source-linked review history</h4>
                  <ol className="audit-timeline">
                    {history.map((ev, i) => (
                      <li key={i}>
                        <span className="timeline-dot" />
                        <div>
                          <time>{date(ev.at)}</time>
                          <h5>{ev.action}</h5>
                          <p>
                            {ev.actor} · Version {ev.version}
                          </p>
                          <p>{ev.reason}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="audit-sources">
                    <strong>Evidence chain</strong>
                    <p>
                      {selected} → SRC-{selected.slice(4)}A / SRC-
                      {selected.slice(4)}B → {current.owner} → attributed events
                    </p>
                    <span>Prior events retained. No drug-change action.</span>
                  </div>
                  <button className="button secondary" onClick={exportRecord}>
                    <span>Download synthetic report</span>
                    <Icon name="download" />
                  </button>
                </div>
              )}
              <div className="local-feedback" role="status">
                {feedback}
              </div>
              <div className="record-bottom">
                <Icon name="lock-keyhole" />
                <span>
                  For pharmacist adjudication. No real records, messages or
                  system writes.
                </span>
              </div>
            </article>
          </div>
          <div className="demo-afterword">
            <p>
              <strong>What this demonstrates:</strong> an evidence-and-review
              interaction model. It does not demonstrate sensitivity, clinical
              benefit, live access or pilot readiness.
            </p>
            <TextLink href="/evaluation">
              Read the evaluation requirements
            </TextLink>
          </div>
        </div>
      </section>
      <dialog
        ref={dialog}
        className="evidence-dialog"
        onCancel={() => setDrawer(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setDrawer(false);
        }}
        aria-labelledby="evidence-title"
      >
        <div className="drawer-heading">
          <div>
            <Eyebrow>Source evidence / Version 1</Eyebrow>
            <h2 id="evidence-title">{sourceId}</h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close evidence"
            onClick={() => setDrawer(false)}
          >
            <Icon name="x" />
          </button>
        </div>
        <DemoBadges />
        <dl>
          <dt>Artifact type</dt>
          <dd>
            {source === 0
              ? "Synthetic reported history"
              : "Synthetic dated history extract"}
          </dd>
          <dt>Observed time</dt>
          <dd>{date(sourceObserved)}</dd>
          <dt>Received time</dt>
          <dd>{date(current.intakeAt)}</dd>
          <dt>Owner</dt>
          <dd>{current.owner}</dd>
          <dt>Completeness</dt>
          <dd>
            {unknown
              ? "Required detail unavailable"
              : "Only the displayed fields are illustrated"}
          </dd>
          <dt>Confidence</dt>
          <dd>Not validated</dd>
        </dl>
        <div className="evidence-excerpt">
          <Eyebrow>Fictional excerpt</Eyebrow>
          <p>Medication X</p>
          <blockquote>
            {unknown
              ? "Required detail missing"
              : conflict
                ? source === 0
                  ? "Reported current"
                  : "Different recorded status"
                : "Displayed fields agree"}
          </blockquote>
        </div>
        <p className="small">
          Source-linked synthetic artifact. No EHR, pharmacy or claims
          connection is implied.
        </p>
        <button className="button secondary" onClick={() => setDrawer(false)}>
          Return to episode
          <Icon name="arrow-left" />
        </button>
      </dialog>
    </>
  );
}
