import React, { useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DemoBadges, Icon, Chip } from "./components";
import { MotionContext } from "./motion-context";

/** An original source-to-review illustration, never an automatic decision. */
export function HeroEvidenceScene() {
  const root = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionContext);
  useEffect(() => {
    if (paused || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const story = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 18%",
          end: "bottom 38%",
          scrub: 0.65,
        },
      });
      story
        .fromTo(
          ".opening-light",
          { xPercent: -12 },
          { xPercent: 18, ease: "none" },
          0,
        )
        .fromTo(
          ".opening-highlight",
          { scaleX: 0.12 },
          { scaleX: 1, ease: "none" },
          0,
        )
        .to(".opening-documents", { y: -8, ease: "none" }, 0)
        .fromTo(
          ".opening-receipt",
          { boxShadow: "0 10px 25px #38201b1f" },
          { boxShadow: "0 24px 45px #38201b38", ease: "none" },
          0,
        );
    }, root);
    return () => context.revert();
  }, [paused]);
  return (
    <div
      className="opening-scene"
      ref={root}
      aria-label="Synthetic episode SYN-002. Two dated accounts of Medication X conflict. Both sources remain visible for Pharmacist Reviewer B; review unresolved."
    >
      <div className="opening-light" aria-hidden="true" />
      <div className="opening-scene-top">
        <span className="mono">RX / LINEAGE IN VIEW</span>
        <span className="mono">SYN–002</span>
      </div>
      <div className="opening-caption">
        <span>Two accounts.</span>
        <em>A difference worth reading.</em>
      </div>
      <DemoBadges />
      <div className="opening-documents">
        <article className="opening-document">
          <div className="opening-doc-index">
            <span>01 / REPORTED</span>
            <Icon name="file-text" />
          </div>
          <h2>
            Reported
            <br />
            history
          </h2>
          <p className="opening-date">
            SRC-002A
            <br />
            12 OCT 2026 · 08:20 UTC
          </p>
          <div className="opening-medication">
            <span>Medication X</span>
            <strong>
              <i className="opening-highlight" aria-hidden="true" />
              Reported current
            </strong>
          </div>
        </article>
        <article className="opening-document">
          <div className="opening-doc-index">
            <span>02 / DATED</span>
            <Icon name="files" />
          </div>
          <h2>
            Pharmacy
            <br />
            history
          </h2>
          <p className="opening-date">
            SRC-002B
            <br />
            05 OCT 2026 · 12:00 UTC
          </p>
          <div className="opening-medication">
            <span>Medication X</span>
            <strong>
              <i className="opening-highlight" aria-hidden="true" />
              Different recorded status
            </strong>
          </div>
        </article>
      </div>
      <div className="opening-source-link" aria-hidden="true">
        <span>Source A</span>
        <Icon name="arrow-right" />
        <span>Source B</span>
      </div>
      <div className="opening-receipt">
        <div className="opening-receipt-heading">
          <Chip type="conflict">Conflicting</Chip>
          <span className="mono">BOTH SOURCES RETAINED</span>
        </div>
        <p>
          No conclusion inferred.
          <br />
          <strong>The review stays with the pharmacist.</strong>
        </p>
        <div className="opening-reviewer">
          <span className="opening-reviewer-mark">PB</span>
          <div>
            <strong>Pharmacist Reviewer B</strong>
            <span>Unresolved · Confidence not validated</span>
          </div>
          <Icon name="lock" />
        </div>
      </div>
      <div className="opening-scene-foot">
        <span>FOR PHARMACIST ADJUDICATION</span>
        <span>SCROLL TO INSPECT ↓</span>
      </div>
    </div>
  );
}
