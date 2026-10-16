import React, { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContext } from "./motion-context";

// This is the chapter's approved 596d8d6 atmosphere, clipped to this section.
// The site's newer daylight backgrounds must not restyle this component.
const approvedColours: Record<string, string> = {
  paper: "#F7F0E7",
  mist: "#E4D4EE",
  lavender: "#CBB2DE",
  white: "#FBF6EF",
  dark: "#281D34",
};
const trace =
  "M1000 0C1500 200 200 440 1050 800S1500 1430 1000 1640 700 2000 1290 2360 950 2910 1250 3400 620 4000 1180 4400 1500 5100 900 5500 200 6400 1100 7000";
export function ApprovedChapterBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const paused = useContext(MotionContext);
  const [canvas, setCanvas] = useState({ top: 0, height: 1, gradient: "" });
  useEffect(() => {
    const chapter = root.current?.closest<HTMLElement>(".lineage-chapter");
    const main = chapter?.closest("main");
    if (!chapter || !main) return;
    let frame = 0;
    const update = () => {
      const stops: string[] = [];
      main
        .querySelectorAll<HTMLElement>(":scope > section[data-tone]")
        .forEach((section) => {
          const blend = Math.min(140, section.offsetHeight * 0.15);
          const colour =
            approvedColours[section.dataset.tone || "paper"] ||
            approvedColours.paper;
          stops.push(
            `${colour} ${Math.round(section.offsetTop + blend)}px`,
            `${colour} ${Math.round(section.offsetTop + section.offsetHeight - blend)}px`,
          );
        });
      const next = {
        top: chapter.offsetTop,
        height: main.offsetHeight,
        gradient: `linear-gradient(to bottom,${stops.join(",")})`,
      };
      setCanvas((old) =>
        JSON.stringify(old) === JSON.stringify(next) ? old : next,
      );
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    observer.observe(main);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (
      paused ||
      !canvas.gradient ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const mm = gsap.matchMedia();
    mm.add("(min-width:901px)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(
          ".approved-chapter-light-one",
          { yPercent: 9, scale: 0.95 },
          {
            yPercent: -7,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }, root);
      return () => context.revert();
    });
    const context = gsap.context(() => {
      const path = root.current?.querySelector<SVGPathElement>(
        ".approved-chapter-progress",
      );
      const main = root.current?.closest("main");
      if (!path || !main) return;
      const length = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: main,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    }, root);
    return () => {
      mm.revert();
      context.revert();
    };
  }, [canvas, paused]);
  return (
    <div
      ref={root}
      className="approved-chapter-backdrop"
      aria-hidden="true"
      data-approved-version="596d8d6"
    >
      <div
        className="approved-chapter-canvas"
        style={{
          top: -canvas.top,
          height: canvas.height,
          backgroundImage: canvas.gradient,
        }}
      />
      <div className="approved-chapter-lights">
        <div className="approved-chapter-light-one" />
        <div className="approved-chapter-light-two" />
      </div>
      <div className="approved-chapter-grain" />
      <svg
        className="approved-chapter-trace"
        viewBox="0 0 1440 7000"
        preserveAspectRatio="none"
        style={{ top: -canvas.top, height: canvas.height }}
      >
        <path d={trace} />
        <path className="approved-chapter-progress" d={trace} />
      </svg>
    </div>
  );
}
