import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header, Footer } from "./components";
import { Home } from "./Home";
import { MotionContext } from "./motion-context";
import { ContentPage, NotFound } from "./Pages";
import { InquiryPage, SignIn } from "./Forms";
import { Demo } from "./Demo";
import { pages, palette } from "./content";
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
    const root = main.current;
    if (!root) return;
    const canvas = root.querySelector<HTMLElement>(".site-atmosphere")!;
    const update = () => {
      const children = Array.from(
        root.querySelectorAll<HTMLElement>(":scope > section[data-tone]"),
      );
      const stops: string[] = [];
      children.forEach((el) => {
        const color =
          palette[el.dataset.tone as keyof typeof palette] || palette.paper;
        const top = el.offsetTop,
          end = top + el.offsetHeight;
        const inset = Math.min(100, el.offsetHeight * 0.1);
        stops.push(
          `${color} ${Math.round(top + inset)}px`,
          `${color} ${Math.round(end - inset)}px`,
        );
      });
      canvas.style.backgroundImage = `linear-gradient(to bottom,${stops.join(",")})`;
      ScrollTrigger.refresh();
    };
    const obs = new ResizeObserver(update);
    obs.observe(root);
    document.fonts.ready.then(() => {
      update();
      if (location.hash) {
        let targetId = location.hash.slice(1);
        try {
          targetId = decodeURIComponent(targetId);
        } catch {
          /* Keep a literal invalid hash harmless. */
        }
        const target = document.getElementById(targetId);
        if (target)
          requestAnimationFrame(() =>
            target.scrollIntoView({ behavior: "instant", block: "start" }),
          );
      }
    });
    update();
    return () => obs.disconnect();
  }, [path]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (motionPaused) return;
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
        gsap.from(".source-a", {
          x: -36,
          y: 35,
          rotation: -4,
          opacity: 0,
          duration: 1.3,
          delay: 0.2,
          ease: "power3.out",
        });
        gsap.from(".source-b", {
          x: 42,
          y: 50,
          rotation: 5,
          opacity: 0,
          duration: 1.3,
          delay: 0.45,
          ease: "power3.out",
        });
        gsap.from(".orbit-conflict", {
          scale: 0.85,
          opacity: 0,
          duration: 0.6,
          delay: 1.3,
        });
        gsap.to(".source-loop", {
          rotation: 15,
          y: 45,
          ease: "none",
          scrollTrigger: {
            trigger: ".home-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      } else {
        gsap.from(".hero-visual", {
          y: 30,
          opacity: 0,
          duration: /legal|contact|sign-in|accessibility|request-/.test(path)
            ? 0.18
            : 1.1,
          ease: "power3.out",
        });
      }
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
    return () => context.revert();
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
        <main id="main" ref={main} tabIndex={-1}>
          <div className="site-atmosphere" aria-hidden="true" />
          <div className="atmosphere-texture" aria-hidden="true" />
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
