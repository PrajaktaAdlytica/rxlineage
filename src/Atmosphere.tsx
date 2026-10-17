import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
type Scene = {
  top: number;
  height: number;
  kind: "hero" | "night" | "reading";
  fill?: string;
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
        else
          next.push({
            top,
            height,
            kind: "reading",
            fill: section.matches(".closing")
              ? "#b8845f"
              : section.matches(".price-section,.faq-section")
                ? "#e4d5c3"
                : section.matches(".case-section")
                  ? "#dbbd9e"
                  : undefined,
          });
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
            ></div>
          ) : scene.kind === "reading" ? (
            <div
              key={i}
              className="reading-scene"
              style={{
                top: scene.top,
                height: scene.height,
                backgroundColor: scene.fill,
              }}
            ></div>
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
