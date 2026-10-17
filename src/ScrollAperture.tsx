import React, { useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContext } from "./motion-context";

export function ScrollAperture({
  main,
  path,
}: {
  main: React.RefObject<HTMLElement | null>;
  path: string;
}) {
  const layer = useRef<HTMLDivElement>(null),
    circle = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionContext);
  const frozen = useRef<gsap.TweenVars | null>(null);
  useEffect(() => {
    const host = main.current,
      viewport = layer.current,
      ring = circle.current;
    if (!host || !viewport || !ring) return;
    gsap.registerPlugin(ScrollTrigger);
    let context: gsap.Context | undefined,
      frame = 0;
    const build = () => {
      context?.revert();
      const w = innerWidth,
        h = innerHeight,
        range = Math.max(1, host.scrollHeight - h);
      const sections = [
        ...host.querySelectorAll<HTMLElement>(":scope > section[data-tone]"),
      ];
      const chapter = host.querySelector<HTMLElement>(".lineage-chapter");
      const diameter = Math.max(w > 900 ? 1100 : 900, w * 0.82);
      const pose = (section: HTMLElement, index: number) => {
        let x = index % 2 ? 0.42 : 0.58,
          y = index % 3 === 0 ? 0.78 : index % 3 === 1 ? 0.7 : 0.85,
          size = diameter;
        if (section.matches(".home-hero,.page-hero,.access-hero")) {
          x = 0.54;
          y = 0.82;
        }
        if (section.matches(".lineage-chapter")) {
          x = 0.5;
          y = 0.6;
          size = 1200;
        }
        if (section.matches(".case-section")) {
          x = 0.5;
          y = 0.58;
          size = diameter * 0.9;
        }
        if (section.matches(".closing")) {
          x = 0.5;
          y = 0.62;
          size = diameter * 0.95;
        }
        return {
          x: x * w,
          y: y * h,
          scale: size / 1000,
          rotation: -50 + index * 28,
          borderColor: section.dataset.tone === "dark" ? "#c8a779" : "#946b50",
          color: section.dataset.tone === "dark" ? "#c8a779" : "#946b50",
        };
      };
      const handoff = () => {
        if (!chapter) {
          viewport.style.visibility = "visible";
          return;
        }
        const bounds = chapter.getBoundingClientRect();
        viewport.style.visibility =
          bounds.top < h && bounds.bottom > 0 ? "hidden" : "visible";
      };
      context = gsap.context(() => {
        const initial = sections[0]
          ? pose(sections[0], 0)
          : { x: w * 0.85, y: h * 0.54, scale: diameter / 1000, rotation: -50 };
        gsap.set(ring, { ...initial, xPercent: -50, yPercent: -50 });
        if (paused && frozen.current) gsap.set(ring, frozen.current);
        if (
          !paused &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: host,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.85,
              onUpdate: handoff,
              onRefresh: handoff,
            },
          });
          let previous = 0;
          sections.slice(1).forEach((section, index) => {
            const progress = Math.min(
              1,
              Math.max(
                previous + 0.001,
                (section.offsetTop +
                  Math.min(section.offsetHeight * 0.22, h * 0.25)) /
                  range,
              ),
            );
            timeline.to(ring, {
              ...pose(section, index + 1),
              duration: progress - previous,
              ease: "none",
            });
            previous = progress;
          });
          if (previous < 1)
            timeline.to(ring, {
              rotation: "+=22",
              duration: 1 - previous,
              ease: "none",
            });
          timeline.progress(timeline.scrollTrigger?.progress || 0);
        }
        if (chapter)
          ScrollTrigger.create({
            trigger: chapter,
            start: "top bottom",
            end: "bottom top",
            onToggle: handoff,
            onRefresh: handoff,
          });
        handoff();
      }, viewport);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(host);
    window.addEventListener("resize", schedule);
    build();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      frozen.current = {
        x: gsap.getProperty(ring, "x"),
        y: gsap.getProperty(ring, "y"),
        scale: gsap.getProperty(ring, "scale"),
        rotation: gsap.getProperty(ring, "rotation"),
        borderColor: getComputedStyle(ring).borderColor,
        color: getComputedStyle(ring).color,
      };
      context?.revert();
      viewport.style.removeProperty("visibility");
    };
  }, [main, path, paused]);
  if (
    path.startsWith("/legal") ||
    path === "/accessibility" ||
    path === "/demo"
  )
    return null;
  return (
    <div ref={layer} className="aperture-viewport" aria-hidden="true">
      <div ref={circle} className="journey-aperture">
        <span />
        <span />
        <i />
      </div>
    </div>
  );
}
