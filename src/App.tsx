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
      media.add("(max-width: 900px), (max-height: 649px)", () => {
        gsap.utils.toArray<HTMLElement>(".chapter-orbit").forEach((el) =>
          gsap.fromTo(
            el,
            { scale: 0.9 },
            {
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section"),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          ),
        );
      });
      gsap.utils.toArray<HTMLElement>(".closing").forEach((section) => {
        gsap.from(section.querySelectorAll(".closing-copy > *"), {
          y: 24,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        timeline.fromTo(
          section.querySelector(".closing-image"),
          { scale: 1.08, yPercent: 2 },
          { scale: 1, yPercent: -2, ease: "none" },
          0,
        );
      });
      gsap.utils
        .toArray<HTMLElement>(".before-after > div")
        .forEach((column, i) => {
          gsap.from(column.querySelectorAll("li"), {
            x: i ? 22 : -22,
            opacity: 0,
            stagger: 0.14,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: column, start: "top 78%", once: true },
          });
        });
      gsap.utils
        .toArray<HTMLElement>(".page-hero .entrance-value strong")
        .forEach((el) => {
          gsap.fromTo(
            el,
            { backgroundColor: "#f4edf8" },
            {
              backgroundColor: "#ead9df",
              ease: "none",
              scrollTrigger: {
                trigger: el.closest(".entrance-workbench"),
                start: "top 20%",
                end: "bottom 60%",
                scrub: 0.5,
              },
            },
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
      gsap.utils.toArray<HTMLElement>(".walk-mobile-visual").forEach((el) =>
        gsap.from(el, {
          y: 25,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
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
          {content}
        </main>
        <Footer />
      </div>
    </MotionContext.Provider>
  );
}
