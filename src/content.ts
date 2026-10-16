import pages from "./pages.json";
import rawOffers from "./offers.json";
import fixtureData from "./fixtures.json";
export { pages };
export const offers = rawOffers as {
  name: string;
  offer: string;
  status: string;
  slug: string;
}[];
export const moduleNames = [
  "Source Comparison",
  "Review Queue",
  "Issue Review",
  "Clarification Drafts",
  "Audit Reports",
];
export const moduleSlugs = [
  "source-comparison",
  "review-queue",
  "issue-review",
  "clarification-drafts",
  "audit-reports",
];
export const moduleDescriptions = [
  "Source-attributed home-med/history comparison",
  "admission/discharge discrepancy review queue",
  "duplicate/allergy/dose issue prioritization for pharmacist adjudication",
  "clarifying-question drafts to prescriber/patient",
  "reconciliation completion and override audit reports",
];
export const moduleIcons = [
  "git-compare",
  "list-filter",
  "circle-alert",
  "message-square-text",
  "clock-arrow-left",
];
export const palette = {
  paper: "#F4F1EA",
  mist: "#E4DDEB",
  lavender: "#D1C4DC",
  white: "#FAF8F4",
  dark: "#302737",
};
export const sources = {
  ahrq: "https://www.ahrq.gov/patient-safety/settings/hospital/match/appendix/app-7.html",
  surescripts:
    "https://surescripts.com/products/medication-history-for-reconciliation",
  drfirst: "https://drfirst.com/medication-history-reconciliation",
  fda: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software",
};
export const primaryMetric =
  "Pharmacist-adjudicated precision at a prespecified queue size";
export const stopRule =
  "Stop or reposition if critical cases are missed or incremental precision over existing history/EHR alerts does not justify pharmacist effort.";
export const gateItems = [
  "8 pharmacist/director interviews",
  "Approved blinded-case review",
  "1 pharmacist informatics champion",
  "1 funded silent-mode scope",
  "Signed data-access, security and human-oversight approvals",
];
export const faqs = [
  [
    "Does RxLineage recommend medication changes?",
    "No. This concept explores source-attributed discrepancy review for pharmacist adjudication. It does not diagnose, recommend treatment, prescribe or change medication orders.",
  ],
  [
    "What does silent mode mean?",
    "A future approved evaluation would compare the proposed queue with current triage without acting on the clinical workflow. Pharmacists define the reference review, endpoints and stop rule before it begins.",
  ],
  [
    "Is this an operating product?",
    "No. The website presents a research-stage concept and a synthetic, browser-local demonstration. There are no customers, clinical results or live integrations represented here.",
  ],
  [
    "What data would an evaluation use?",
    "Only a bounded dataset approved by the sponsor after data-use, security and safety review. The current demo contains fictional records only. Do not enter or upload patient information.",
  ],
  [
    "How would you judge whether it helps?",
    "Compare pharmacist-adjudicated precision at an agreed queue size with current triage. Track missed critical discrepancies, false-alert burden and review time, with denominators and uncertainty. No results are established yet.",
  ],
  [
    "What would the proposed evaluation cost?",
    "The hypothetical test price is $3,000 per hospital site per month plus $8,000 evaluation setup. It is a willingness-to-pay hypothesis, not an active offer or accepted market price.",
  ],
  [
    "Can it connect to our EHR or pharmacy system?",
    "Integration is a discovery question. No live connections are implemented or promised. Input contracts, integration rights, permissions and ownership would need to be agreed with the sponsor.",
  ],
];
export type Episode = {
  id: string;
  state: string;
  owner: string;
  intakeAt: string;
  sourceObservedAt: string[];
  assignedAt: string;
  nextReviewAt?: string;
  reviewedAt?: string;
  reason: string;
};
export const episodes: Episode[] = fixtureData.episodes.map((e, i) => {
  const intake = new Date(e.intakeAt);
  const before = (m: number) => new Date(+intake - m * 60000).toISOString();
  return {
    ...e,
    sourceObservedAt:
      "sourceObservedAt" in e
        ? (e.sourceObservedAt as string[])
        : i === 6
          ? [before(10), before(10)]
          : [before(10), before(5)],
    assignedAt: new Date(+intake + 60000).toISOString(),
    nextReviewAt:
      "nextReviewAt" in e
        ? (e.nextReviewAt as string)
        : !["completed", "rejected-flag"].includes(e.state)
          ? `2026-10-12T11:${i % 2 ? "30" : "45"}:00Z`
          : undefined,
    reviewedAt:
      "reviewedAt" in e
        ? (e.reviewedAt as string)
        : e.state === "completed"
          ? "2026-10-12T09:20:00Z"
          : e.state === "rejected-flag"
            ? "2026-10-12T09:25:00Z"
            : undefined,
    reason:
      i === 6
        ? "Duplicate flag rejected: both references describe the same source event."
        : i === 2 || i === 8
          ? "A required field cannot be established from the supplied sources."
          : i === 1
            ? "Available sources report different statuses for Medication X."
            : e.state === "completed"
              ? "The displayed source fields agree in this example."
              : "Awaiting pharmacist inspection of dated source evidence.",
  };
});
export const stateLabels: Record<string, string> = {
  completed: "Completed",
  "in-review": "In review",
  "blocked-abstained": "Abstained",
  pending: "Pending",
  "rejected-flag": "Flag rejected",
};
export const date = (s: string) =>
  new Date(s).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  }) + " UTC";
