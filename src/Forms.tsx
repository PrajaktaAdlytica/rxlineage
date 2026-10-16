import React, { useRef, useState } from "react";
import {
  PageHero,
  Icon,
  Button,
  TextLink,
  Eyebrow,
  HeroArt,
} from "./components";
import { moduleNames } from "./content";
type Fields = {
  role: string;
  organization: string;
  email: string;
  region: string;
  workflow: string;
  interest: string;
  consent: boolean;
};

function Field({
  name,
  label,
  children,
  error,
}: {
  name: keyof Fields;
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p className="field-error" id={name + "-error"}>
          {error}
        </p>
      )}
    </div>
  );
}
export function InquiryPage({
  kind = "pilot",
}: {
  kind?: "pilot" | "demo" | "contact";
}) {
  const [fields, setFields] = useState<Fields>({
      role: "",
      organization: "",
      email: "",
      region: "",
      workflow: "",
      interest: "Full workflow",
      consent: false,
    }),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [prepared, setPrepared] = useState(false),
    [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isPilot = kind === "pilot";
  const slug = isPilot
    ? "request-pilot"
    : kind === "demo"
      ? "request-demo"
      : "contact";
  const change = (name: keyof Fields, value: string | boolean) => {
    setFields((f) => ({ ...f, [name]: value }));
    setPrepared(false);
    setErrors((e) => ({ ...e, [name]: "" }));
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!fields.role) next.role = "Choose your organizational role.";
    if (!fields.organization.trim())
      next.organization = "Enter an organization.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = "Enter a valid work email.";
    if (!fields.region.trim()) next.region = "Enter your site or region.";
    if (!fields.workflow) next.workflow = "Choose a workflow to discuss.";
    if (!fields.consent)
      next.consent = "Confirm the draft-only collection notice.";
    setErrors(next);
    if (Object.keys(next).length) {
      setPrepared(false);
      setTimeout(
        () =>
          formRef.current
            ?.querySelector<HTMLElement>('[aria-invalid="true"]')
            ?.focus(),
        0,
      );
      return;
    }
    setPrepared(true);
  };
  const draft = () =>
    JSON.stringify(
      {
        brand: "RxLineage",
        type: kind + " inquiry draft",
        delivery: "Not submitted",
        noticeVersion: "2026-10-16-draft",
        preparedAt: new Date().toISOString(),
        ...fields,
        clinicalData: "None requested",
      },
      null,
      2,
    );
  const download = () => {
    const blob = new Blob([draft()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RxLineage-inquiry-draft.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft());
      setCopied(true);
    } catch {
      setCopied(false);
      setErrors((e) => ({
        ...e,
        copy: "Clipboard unavailable. Download the draft instead.",
      }));
    }
  };

  return (
    <>
      <PageHero
        slug={slug}
        cta={false}
        description={
          isPilot
            ? "For pharmacy directors, medication-safety leads and pharmacist informatics champions. Define a bounded evaluation before any clinical build."
            : kind === "demo"
              ? "Choose the full workflow or a proposed module for a guided discussion. You can explore the synthetic demo immediately."
              : "Bring an organizational workflow question. Keep patient information, clinical records and credentials out."
        }
      />
      <section className="section form-section" data-tone="mist">
        <div className="container form-layout">
          <aside>
            <Eyebrow>
              {isPilot ? "A scoped starting point" : "A useful conversation"}
            </Eyebrow>
            <h2>
              {isPilot
                ? "Agree the review.\nThen the scope."
                : "Start with the sources."}
            </h2>
            <ol className="quiet-steps">
              <li>
                <span>01</span>Identify the workflow and its current owner.
              </li>
              <li>
                <span>02</span>Bring an informatics champion into the review.
              </li>
              <li>
                <span>03</span>Agree evidence, rights, guardrails and funding.
              </li>
            </ol>
            <div className="notice">
              <Icon name="circle-alert" />
              <div>
                <strong>This form prepares a local draft.</strong>
                <p>
                  No delivery service is connected. Nothing is submitted or
                  stored by this application. Download your draft for a later
                  conversation.
                </p>
              </div>
            </div>
            <TextLink href="/demo">Open the synthetic demo now</TextLink>
          </aside>
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="inquiry-form"
          >
            <div className="form-heading">
              <span className="form-index">RX / ORGANIZATIONAL INQUIRY</span>
              <h3>
                {isPilot
                  ? "Request a scoped pilot"
                  : kind === "demo"
                    ? "Request a guided walkthrough"
                    : "Contact RxLineage"}
              </h3>
              <p>
                Business context only. No patients, clinical details or uploaded
                records.
              </p>
            </div>
            <div className="form-grid">
              <Field error={errors.role} name="role" label="Your role">
                <select
                  id="role"
                  value={fields.role}
                  aria-invalid={!!errors.role}
                  aria-describedby={errors.role ? "role-error" : undefined}
                  onChange={(e) => change("role", e.target.value)}
                  required
                >
                  <option value="">Select a role</option>
                  {[
                    "Health-system pharmacy director",
                    "Medication-safety lead",
                    "Pharmacist informatics champion",
                    "Oversight / security reviewer",
                    "Other organizational role",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field
                error={errors.organization}
                name="organization"
                label="Organization"
              >
                <input
                  id="organization"
                  autoComplete="organization"
                  value={fields.organization}
                  aria-invalid={!!errors.organization}
                  aria-describedby={
                    errors.organization ? "organization-error" : undefined
                  }
                  maxLength={120}
                  onChange={(e) => change("organization", e.target.value)}
                  required
                />
              </Field>
              <Field error={errors.email} name="email" label="Work email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  maxLength={160}
                  onChange={(e) => change("email", e.target.value)}
                  required
                />
              </Field>
              <Field error={errors.region} name="region" label="Site / region">
                <input
                  id="region"
                  value={fields.region}
                  aria-invalid={!!errors.region}
                  aria-describedby={errors.region ? "region-error" : undefined}
                  maxLength={120}
                  onChange={(e) => change("region", e.target.value)}
                  required
                />
              </Field>
              <div className="full">
                <Field
                  error={errors.workflow}
                  name="workflow"
                  label="Where would you first evaluate source-attributed discrepancy review?"
                >
                  <select
                    id="workflow"
                    value={fields.workflow}
                    aria-invalid={!!errors.workflow}
                    aria-describedby={
                      errors.workflow ? "workflow-error" : undefined
                    }
                    onChange={(e) => change("workflow", e.target.value)}
                    required
                  >
                    <option value="">Choose a workflow</option>
                    <option>Admission</option>
                    <option>Discharge</option>
                    <option>Ambulatory transitions — future discussion</option>
                    <option>Another organizational workflow</option>
                  </select>
                </Field>
              </div>
              {kind === "demo" && (
                <div className="field full">
                  <label htmlFor="interest">Area of interest</label>
                  <select
                    id="interest"
                    value={fields.interest}
                    onChange={(e) => change("interest", e.target.value)}
                  >
                    {["Full workflow", ...moduleNames].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <label className="consent">
              <input
                type="checkbox"
                checked={fields.consent}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                onChange={(e) => change("consent", e.target.checked)}
                required
              />
              <span>
                I understand this prepares a local draft, with no submission. I
                have read the <a href="/legal/privacy">draft privacy notice</a>{" "}
                and will not include patient or clinical information.
              </span>
            </label>
            {errors.consent && (
              <p className="field-error" id="consent-error">
                {errors.consent}
              </p>
            )}
            <button className="button shutter" type="submit">
              <span>Prepare inquiry draft</span>
              <Icon name="arrow-right" />
            </button>
            <p className="small">
              A prepared draft is not a pilot commitment or confirmation of
              eligibility.
            </p>
            <div aria-live="polite">
              {prepared && (
                <div className="draft-result">
                  <Icon name="file-text" />
                  <h4>Your local draft is ready.</h4>
                  <p>
                    Nothing has been sent. Save this draft for a future scoped
                    conversation. No response or access has been scheduled.
                  </p>
                  <div className="actions">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={download}
                    >
                      Download draft
                      <Icon name="download" />
                    </button>
                    <button type="button" className="text-link" onClick={copy}>
                      {copied ? "Copied draft" : "Copy draft"}
                      <Icon name="copy" />
                    </button>
                  </div>
                  {errors.copy && <p>{errors.copy}</p>}
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
export function SignIn() {
  const [help, setHelp] = useState(false);
  return (
    <>
      <section className="section access-hero" data-tone="mist">
        <div className="container access-layout">
          <div data-reveal>
            <Eyebrow>Concept preview access</Eyebrow>
            <h1>
              A clear view.
              <br />
              <em>No account required.</em>
            </h1>
            <p className="lead">
              The synthetic workflow is open to explore. A customer portal and
              clinical product are not operating.
            </p>
            <HeroArt slug="sign-in" />
          </div>
          <div className="access-card">
            <img
              src="/brand/assets/logo/rxlineage-symbol-primary.svg"
              width="56"
              height="70"
              alt=""
            />
            <h2>Welcome to the preview.</h2>
            <p>
              No credentials are requested, collected or verified on this page.
            </p>
            <Button href="/demo">Open synthetic demo</Button>
            <a className="button secondary" href="/request-demo">
              Ask about evaluation access
              <Icon name="arrow-up-right" />
            </a>
            <button
              className="text-link"
              onClick={() => setHelp(!help)}
              aria-expanded={help}
            >
              Access help & recovery
              <Icon name="circle-question-mark" />
            </button>
            {help && (
              <div className="notice">
                <p>
                  There are no connected accounts to recover. If you were
                  expecting access to an evaluation, confirm the scope with its
                  sponsor. You can prepare an access inquiry without entering a
                  password.
                </p>
              </div>
            )}
            <hr />
            <p className="small">
              DEMO / SYNTHETIC DATA · CONCEPT PREVIEW
              <br />
              No SSO, EHR connection or clinical records.
            </p>
            <a href="/legal/privacy">Read the privacy notice</a>
          </div>
        </div>
      </section>
    </>
  );
}
