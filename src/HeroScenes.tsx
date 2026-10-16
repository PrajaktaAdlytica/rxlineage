import React from "react";
import { DemoBadges, Chip, Icon, TextLink, Eyebrow } from "./components";
export function QueueScene() {
  const rows = [
    ["SYN-002", "Conflicting", "conflict", "B", "10:30"],
    ["SYN-003", "Unknown / Abstained", "unknown", "C", "11:00"],
    ["SYN-007", "Flag rejected", "neutral", "A", "09:25"],
  ];
  return (
    <div className="scene-workspace queue-scene">
      <div className="scene-workspace-top">
        <span>
          <Icon name="list-filter" />
          Review Queue
        </span>
        <span className="mono">ADMISSION / DISCHARGE</span>
      </div>
      <DemoBadges />
      <div className="scene-queue-head">
        <span>Episode / state</span>
        <span>Owner / UTC</span>
      </div>
      {rows.map(([id, status, type, owner, time]) => (
        <a
          className="scene-queue-row scene-piece"
          href={"/demo?episode=" + id + "#episodes"}
          key={id}
        >
          <div>
            <strong>{id}</strong>
            <Chip type={type}>{status}</Chip>
          </div>
          <div>
            <span className="scene-reviewer">P{owner}</span>
            <small>
              Reviewer {owner}
              <br />
              {time} UTC
            </small>
          </div>
          <Icon name="arrow-up-right" />
        </a>
      ))}
      <p className="scene-footnote">
        3 of 9 synthetic fixtures shown · Not live telemetry
      </p>
      <div className="scene-floating-note">
        <Icon name="user-round" />
        <span>
          A reviewer and next action.
          <br />
          <strong>For every exception.</strong>
        </span>
      </div>
    </div>
  );
}
export function IssueScene() {
  return (
    <div className="issue-scene">
      <div className="issue-index">
        <span>Proposed issue categories</span>
        <div>
          <Chip>Duplicate</Chip>
          <Chip>Allergy</Chip>
          <Chip>Dose</Chip>
        </div>
      </div>
      <article className="scene-workspace scene-piece">
        <div className="scene-workspace-top">
          <span>
            <Icon name="circle-alert" />
            Inspect the reason
          </span>
          <span className="mono">SYN-007</span>
        </div>
        <DemoBadges />
        <h3>A flag can be rejected.</h3>
        <p className="scene-statement">
          Two references.
          <br />
          The same source event.
        </p>
        <div className="issue-source-pair">
          <span>
            SRC-007A
            <br />
            <small>12 Oct · 08:20 UTC</small>
          </span>
          <Icon name="git-compare" />
          <span>
            SRC-007B
            <br />
            <small>12 Oct · 08:20 UTC</small>
          </span>
        </div>
        <div className="issue-verdict">
          <Icon name="user-round" />
          <p>
            Illustrative duplicate concern rejected by Pharmacist Reviewer A.
            <br />
            <strong>12 Oct 2026 · 09:25 UTC</strong>
          </p>
        </div>
        <TextLink href="/demo?episode=SYN-007#episodes">
          Inspect the rejection
        </TextLink>
        <p className="scene-footnote">
          For pharmacist adjudication. No clinical recommendation.
        </p>
      </article>
    </div>
  );
}
export function DraftScene() {
  return (
    <div className="draft-scene">
      <div className="draft-source-label">
        <Icon name="git-compare" />
        <span>SYN-002 / Conflicting accounts</span>
      </div>
      <article className="scene-workspace scene-piece">
        <DemoBadges />
        <div className="scene-workspace-top">
          <span>Clarification draft</span>
          <Chip type="conflict">Unsent</Chip>
        </div>
        <div className="scene-owner">
          <span className="scene-reviewer">PB</span>
          <div>
            <strong>Pharmacist Reviewer B</strong>
            <span>Next review · 12 Oct · 10:30 UTC</span>
          </div>
        </div>
        <div className="scene-draft-text">
          <span className="draft-typed">
            Which source needs clarification before this review can close?
          </span>
        </div>
        <div className="draft-boundary">
          <Icon name="lock-keyhole" />
          <p>Draft only. No send, patient contact or system write.</p>
        </div>
        <TextLink href="/demo?episode=SYN-002#episodes">
          Inspect the unresolved review
        </TextLink>
      </article>
    </div>
  );
}
export function AuditScene() {
  return (
    <div className="scene-workspace audit-scene">
      <div className="scene-workspace-top">
        <span>
          <Icon name="clock-arrow-left" />
          An inspectable record
        </span>
        <span className="mono">SYN-001</span>
      </div>
      <DemoBadges />
      <div className="scene-audit-events">
        {[
          ["08:00", "Sources received", "SRC-001A / SRC-001B"],
          ["08:01", "Reviewer assigned", "Pharmacist Reviewer A"],
          ["09:10", "Review recorded", "Displayed source fields agree"],
        ].map(([t, title, detail]) => (
          <div className="scene-audit-event scene-piece" key={t}>
            <span className="scene-event-dot" />
            <time>
              {t}
              <small>12 OCT / UTC</small>
            </time>
            <div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="scene-audit-seal">
        <Icon name="user-round" />
        <span>
          Human-attributed.
          <br />
          <strong>Prior events retained.</strong>
        </span>
      </div>
      <p className="scene-footnote">
        Illustrative audit states. No clinical clearance or order change.
      </p>
      <TextLink href="/demo?episode=SYN-001&view=audit#episodes">
        Open the synthetic audit
      </TextLink>
    </div>
  );
}
