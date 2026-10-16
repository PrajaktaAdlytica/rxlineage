import React, { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContext } from "./motion-context";
type Scene = {
  top: number;
  height: number;
  kind: "hero" | "night" | "reading";
};
export function atmosphereFamily(path: string) {
  if (path === "/") return "evidence";
  if (path.startsWith("/products")) return "folio";
  if (path.startsWith("/solutions")) return "transition";
  if (path === "/platform") return "lineage";
  if (path === "/pricing" || path === "/evaluation") return "copper";
  if (path.startsWith("/resources")) return "editorial";
  if (path.startsWith("/legal") || path === "/accessibility") return "quiet";
  if (path === "/about") return "horizon";
  return "invitation";
}
export function Atmosphere({
  root,
  path,
}: {
  root: React.RefObject<HTMLElement | null>;
  path: string;
}) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const layer = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionContext);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0,
      alive = true;
    const update = () => {
      const sections = [
        ...el.querySelectorAll<HTMLElement>(":scope > section[data-tone]"),
      ];
      const next: Scene[] = [];
      for (const section of sections) {
        const top = Math.round(section.offsetTop),
          height = Math.round(section.offsetHeight);
        if (section.dataset.tone === "dark") {
          const previous = next.at(-1);
          if (
            previous?.kind === "night" &&
            Math.abs(previous.top + previous.height - top) < 3
          )
            previous.height = top + height - previous.top;
          else next.push({ top, height, kind: "night" });
        } else if (section.matches(".home-hero,.page-hero,.access-hero"))
          next.push({ top, height, kind: "hero" });
        else next.push({ top, height, kind: "reading" });
      }
      el.classList.add("has-atmosphere");
      setScenes((old) =>
        JSON.stringify(old) === JSON.stringify(next) ? old : next,
      );
      ScrollTrigger.refresh();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    update();
    document.fonts.ready.then(() => {
      if (!alive) return;
      update();
      if (location.hash) {
        let id = location.hash.slice(1);
        try {
          id = decodeURIComponent(id);
        } catch {}
        requestAnimationFrame(() =>
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "instant", block: "start" }),
        );
      }
    });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [path, root]);
  useEffect(() => {
    if (
      paused ||
      !scenes.length ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".daylight-planes").forEach((el) =>
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: 35,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".daylight-scene"),
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          },
        ),
      );
      gsap.utils
        .toArray<HTMLElement>(".daylight-bloom,.reading-bloom")
        .forEach((el) =>
          gsap.fromTo(
            el,
            { scale: 0.88, yPercent: -3, opacity: 0.55 },
            {
              scale: 1.18,
              yPercent: 4,
              opacity: 0.95,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          ),
        );
    }, layer);
    return () => context.revert();
  }, [paused, scenes]);
  return (
    <>
      <div className="site-atmosphere" aria-hidden="true" />
      <div ref={layer} className="daylight-canvas" aria-hidden="true">
        {scenes.map((scene, i) =>
          scene.kind === "hero" ? (
            <div
              key={i}
              className="daylight-scene"
              style={{ top: scene.top, height: scene.height }}
            >
              <div className="daylight-bloom" />
              <svg
                className="daylight-planes"
                viewBox="0 0 1440 850"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 700C450 860 950 560 1440 680V850H0Z"
                  fill="#D0ACE5"
                />
                <path
                  d="M0 800C440 920 1100 640 1440 760V850H0Z"
                  fill="#BE97D8"
                />
                <path
                  d="M650 850C1100 690 1300 710 1440 750V850Z"
                  fill="#B18BCF"
                />
              </svg>
            </div>
          ) : scene.kind === "reading" ? (
            <div
              key={i}
              className="reading-scene"
              style={{ top: scene.top, height: scene.height }}
            >
              <div className="reading-bloom" />
            </div>
          ) : (
            <div
              key={i}
              className="night-scene"
              style={{ top: scene.top, height: scene.height }}
            >
              <svg
                className="night-edge night-edge-top"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
              >
                <path d="M0 30C360 100 1080 -30 1440 30V100H0Z" />
              </svg>
              <div className="night-core" />
              <svg
                className="night-edge night-edge-bottom"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
              >
                <path d="M0 0H1440V70C1080 0 360 130 0 70Z" />
              </svg>
            </div>
          ),
        )}
      </div>
    </>
  );
}
