import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MotionContext } from "../motion-context";
const IntroPlayer = lazy(() => import("./IntroPlayer"));
class IntroBoundary extends React.Component<
  { children: React.ReactNode; onFailure?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function Intro({
  onResumeMotion,
  backdropTarget,
}: {
  onResumeMotion?: () => void;
  backdropTarget?: HTMLElement | null;
}) {
  const paused = useContext(MotionContext);
  const stage = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => {
      setReduced(motion.matches);
      setMobile(narrow.matches);
      setReady(true);
    };
    update();
    motion.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    const el = stage.current,
      site = el?.closest<HTMLElement>(".site");
    if (!el || !site) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        site.dataset.introVisible = String(
          entry.isIntersecting && entry.intersectionRatio > 0.02,
        );
      },
      { threshold: 0.02 },
    );
    observer.observe(el);
    const header = site.querySelector<HTMLElement>(".site-header");
    const measure = () => {
      if (header) {
        site.style.setProperty(
          "--opening-header-height",
          `${header.getBoundingClientRect().height}px`,
        );
        const padding =
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) || 0;
        site.style.setProperty(
          "--intro-skip-margin",
          `${header.getBoundingClientRect().height - padding}px`,
        );
      }
    };
    measure();
    const sizeObserver = new ResizeObserver(measure);
    if (header) sizeObserver.observe(header);
    return () => {
      sizeObserver.disconnect();
      site.style.removeProperty("--intro-skip-margin");
      site.style.removeProperty("--opening-header-height");
      observer.disconnect();
      delete site.dataset.introVisible;
    };
  }, []);
  return (
    <section
      ref={stage}
      className="rx-intro"
      aria-labelledby="intro-title"
      data-intro-mode={
        paused || (ready && reduced) || failed ? "still" : "motion"
      }
    >
      <noscript>
        <style>{".rx-intro .intro-backup{visibility:visible!important}"}</style>
      </noscript>
      <h2 id="intro-title" className="sr-only">
        Every history has a source. RxLineage research-stage concept.
      </h2>
      <div className="intro-film">
        <div className="intro-still" aria-hidden="true">
          <div className="intro-backup">
            <img
              src="/brand/assets/logo/rxlineage-horizontal-reverse-accent.svg"
              alt=""
            />
            <p>
              Every history
              <br className="intro-mobile-break" /> has a <em>source.</em>
            </p>
            <span>RESEARCH-STAGE CONCEPT</span>
          </div>
        </div>
        {ready && !reduced && !paused && !failed && (
          <IntroBoundary onFailure={() => setFailed(true)}>
            <Suspense fallback={null}>
              <IntroPlayer
                mobile={mobile}
                paused={paused}
                backdropTarget={backdropTarget}
              />
            </Suspense>
          </IntroBoundary>
        )}
      </div>
      {ready && paused && !reduced && onResumeMotion && (
        <div className="intro-controls">
          <button type="button" onClick={onResumeMotion}>
            Enable motion <span aria-hidden="true">▷</span>
          </button>
        </div>
      )}
      <a className="intro-skip" href="#home-hero">
        Skip intro <span aria-hidden="true">↗</span>
      </a>
      <a className="intro-continue" href="#home-hero">
        Follow the evidence <span aria-hidden="true">↓</span>
      </a>
      {ready && reduced && (
        <span className="intro-static-note">
          Still preview · reduced motion
        </span>
      )}
    </section>
  );
}
