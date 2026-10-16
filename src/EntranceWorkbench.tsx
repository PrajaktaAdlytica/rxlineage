import React from "react";
import { DemoBadges, Icon, Chip } from "./components";

export function EntranceWorkbench() {
  return (
    <div
      className="entrance-workbench"
      aria-label="Synthetic source comparison for episode SYN-002; conflicting records remain unresolved for pharmacist review."
    >
      <div className="entrance-top">
        <span className="entrance-mark">
          <Icon name="git-compare" /> Source review
        </span>
        <span className="mono">SYN–002 / 01</span>
      </div>
      <DemoBadges />
      <div className="entrance-heading">
        <span className="mono">TWO ACCOUNTS. ONE OPEN QUESTION.</span>
        <h2>
          The difference,
          <br />
          <em>in plain sight.</em>
        </h2>
      </div>
      <div className="entrance-sources">
        <article className="entrance-source entrance-source-a">
          <div className="entrance-source-index">
            <span>01 / REPORTED</span>
            <Icon name="file-text" />
          </div>
          <h3>
            Reported
            <br />
            history
          </h3>
          <p className="entrance-source-date">
            SRC-002A · 12 OCT 2026
            <br />
            08:20 UTC
          </p>
          <div className="entrance-value">
            <span>Medication X</span>
            <strong>Reported current</strong>
          </div>
        </article>
        <article className="entrance-source entrance-source-b">
          <div className="entrance-source-index">
            <span>02 / DATED</span>
            <Icon name="files" />
          </div>
          <h3>
            Pharmacy
            <br />
            history
          </h3>
          <p className="entrance-source-date">
            SRC-002B · 05 OCT 2026
            <br />
            12:00 UTC
          </p>
          <div className="entrance-value">
            <span>Medication X</span>
            <strong>Different recorded status</strong>
          </div>
        </article>
      </div>
      <div className="entrance-finding">
        <Chip type="conflict">Conflicting</Chip>
        <span>
          Both sources retained.
          <br />
          No conclusion inferred.
        </span>
      </div>
      <div className="entrance-owner">
        <span className="entrance-avatar">PB</span>
        <div>
          <strong>Pharmacist Reviewer B</strong>
          <span>Review unresolved · Confidence not validated</span>
        </div>
        <Icon name="lock" />
      </div>
      <p className="entrance-foot">
        Received 12 Oct · 08:25 UTC · Next review 10:30 UTC
      </p>
    </div>
  );
}
