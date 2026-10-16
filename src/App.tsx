import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header, Footer } from "./components";
import { Home } from "./Home";
import { MotionContext } from "./motion-context";
import { ContentPage, NotFound } from "./Pages";
import { InquiryPage, SignIn } from "./Forms";
import { Demo } from "./Demo";
import { pages } from "./content";
import { Atmosphere, atmosphereFamily } from "./Atmosphere";
export function App({ initialPath = "/" }: { initialPath?: string }) {
  const path = initialPath.replace(/\/$/, "") || "/";
  const [paused, setPaused] = useState(false);
  const [preference, setPreference] = useState(false);
  const main = useRef<HTMLElement>(null);
  const motionPaused = paused || preference;
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    setPreference(q.matches);
    const cb = () => setPreference(q.matches);
    q.addEventListener("change", cb);
    return () => q.removeEventListener("change", cb);
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (motionPaused) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
      if (path === "/") {
        gsap.from(".hero-copy > *", {
          y: 24,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
        gsap.from(".entrance-workbench", {
          y: 35,
          opacity: 0,
          duration: 1.1,
          delay: 0.25,
          ease: "power3.out",
        });
        gsap.from(".entrance-source", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.16,
          delay: 0.6,
          ease: "power3.out",
        });
        gsap.from(".entrance-finding", {
          y: 10,
          opacity: 0,
          duration: 0.6,
          delay: 1.05,
        });
      } else if (main.current?.querySelector(".hero-visual")) {
        gsap.from(".hero-visual", {
          y: 30,
          opacity: 0,
          duration: /legal|contact|sign-in|accessibility|request-/.test(path)
            ? 0.18
            : 1.1,
          ease: "power3.out",
        });
      }
      media.add("(min-width: 901px) and (min-height: 650px)", () => {
        gsap.utils.toArray<HTMLElement>(".hero-scene-contents").forEach((el) =>
          gsap.to(el, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section"),
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          }),
        );
        gsap.utils.toArray<HTMLElement>(".hero-scene-orbit").forEach((el) =>
          gsap.to(el, {
            rotation: "+=32",
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }),
        );
        gsap.utils.toArray<HTMLElement>(".chapter-orbit").forEach((el) =>
          gsap.fromTo(
            el,
            { scale: 0.68, rotation: -20 },
            {
              scale: 1.18,
              rotation: 35,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section"),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          ),
        );
      });
      gsap.utils
        .toArray<HTMLElement>(".lineage-chapter .chapter-copy > *")
        .forEach((el, i) =>
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 1,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".lineage-chapter",
              start: "top 65%",
              once: true,
            },
          }),
        );
      gsap.utils.toArray<HTMLElement>(".scene-piece").forEach((el, i) =>
        gsap.from(el, {
          y: 25,
          opacity: 0,
          duration: 0.9,
          delay: 0.2 + (i % 4) * 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        }),
      );
      gsap.utils
        .toArray<HTMLElement>(".draft-typed,.review-note blockquote")
        .forEach((el) =>
          gsap.from(el, {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );
      gsap.utils.toArray<HTMLElement>(".walk-mobile-visual").forEach((el) =>
        gsap.from(el, {
          y: 25,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
      gsap.utils.toArray<HTMLElement>(".closing-orbit").forEach((el) =>
        gsap.fromTo(
          el,
          { scale: 0.82, rotation: -22 },
          {
            scale: 1.05,
            rotation: 7,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        ),
      );
      const pathEl =
        main.current?.querySelector<SVGPathElement>(".lineage-progress");
      if (pathEl) {
        const length = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: main.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      }
    }, main);
    return () => {
      media.revert();
      context.revert();
    };
  }, [path, motionPaused]);
  useEffect(() => {
    const visibility = () =>
      document.documentElement.classList.toggle("page-hidden", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  const known = pages.some((p) => p.route === path);
  let content: React.ReactNode =
    path === "/" ? (
      <Home />
    ) : path === "/demo" ? (
      <Demo />
    ) : path === "/request-pilot" ? (
      <InquiryPage />
    ) : path === "/request-demo" ? (
      <InquiryPage kind="demo" />
    ) : path === "/contact" ? (
      <InquiryPage kind="contact" />
    ) : path === "/sign-in" ? (
      <SignIn />
    ) : known ? (
      <ContentPage path={path} />
    ) : (
      <NotFound />
    );
  return (
    <MotionContext.Provider value={motionPaused}>
      <div className={"site " + (motionPaused ? "motion-paused" : "")}>
        <Header
          path={path}
          motionPaused={motionPaused}
          onMotion={() => {
            if (preference) setPreference(false);
            setPaused(!motionPaused);
          }}
        />
        <main
          id="main"
          ref={main}
          tabIndex={-1}
          data-family={atmosphereFamily(path)}
          data-page={path}
        >
          <Atmosphere root={main} path={path} />
          <svg
            className="global-thread"
            viewBox="0 0 1440 7000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M1000 0C1500 200 200 440 1050 800S1500 1430 1000 1640 700 2000 1290 2360 950 2910 1250 3400 620 4000 1180 4400 1500 5100 900 5500 200 6400 1100 7000" />
            <path
              className="lineage-progress"
              d="M1000 0C1500 200 200 440 1050 800S1500 1430 1000 1640 700 2000 1290 2360 950 2910 1250 3400 620 4000 1180 4400 1500 5100 900 5500 200 6400 1100 7000"
            />
          </svg>
          {content}
        </main>
        <Footer />
      </div>
    </MotionContext.Provider>
  );
}
