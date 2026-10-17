import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { MotionContext } from "../motion-context";
const IntroPlayer = lazy(() => import("./IntroPlayer"));
class IntroBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function Intro() {
  const paused = useContext(MotionContext);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = matchMedia("(max-width: 600px)");
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
  return (
    <section className="rx-intro" aria-labelledby="intro-title">
      <h2 id="intro-title" className="sr-only">
        Every history has a source. RxLineage research-stage concept.
      </h2>
      <div className="intro-film">
        <div className="intro-still" aria-hidden="true">
          <picture>
            <source
              media="(max-width:600px)"
              srcSet="/media/intro-ink-mobile.webp"
            />
            <img
              className="intro-poster"
              src="/media/intro-ink-desktop.webp"
              alt=""
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </picture>
          <div className="intro-backup">
            <img
              src="/brand/assets/logo/rxlineage-horizontal-reverse.svg"
              alt=""
            />
            <p>
              Every history has a <em>source.</em>
            </p>
            <span>RESEARCH-STAGE CONCEPT</span>
          </div>
        </div>
        {ready && !reduced && !paused && (
          <IntroBoundary>
            <Suspense fallback={null}>
              <IntroPlayer mobile={mobile} paused={paused} />
            </Suspense>
          </IntroBoundary>
        )}
      </div>
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
