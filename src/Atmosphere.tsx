import React, { useContext, useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { MotionContext } from "./motion-context";
import { ScrollTrigger } from "gsap/ScrollTrigger";
type Field = {
  top: number;
  height: number;
  dark: boolean;
  side: string;
  kind: string;
};
const canvas: Record<string, string> = {
  paper: "#F8F5EF",
  mist: "#EAE2F2",
  lavender: "#DDD1EE",
  white: "#FBF9F5",
  dark: "#281D34",
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
  const [fields, setFields] = useState<Field[]>([]);
  const motionPaused = useContext(MotionContext);
  const lights = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0,
      alive = true;
    const update = () => {
      const sections = [
        ...el.querySelectorAll<HTMLElement>(":scope > section[data-tone]"),
      ];
      const stops: string[] = [];
      const next: Field[] = [];
      sections.forEach((section, i) => {
        const tone = section.dataset.tone || "paper";
        const top = section.offsetTop,
          height = section.offsetHeight;
        const blend = Math.min(140, height * 0.15);
        const c = canvas[tone] || canvas.paper;
        stops.push(
          `${c} ${Math.round(top + blend)}px`,
          `${c} ${Math.round(top + height - blend)}px`,
        );
        next.push({
          top: Math.round(top),
          height: Math.round(height),
          dark: tone === "dark",
          side: i % 3 === 0 ? "right" : i % 3 === 1 ? "left" : "center",
          kind: section.classList.contains("lineage-chapter")
            ? "chapter-preserved"
            : section.classList.contains("page-hero") ||
                section.classList.contains("home-hero") ||
                section.classList.contains("access-hero")
              ? "hero"
              : tone === "dark"
                ? "archive"
                : "paper",
        });
      });
      const bg = el.querySelector<HTMLElement>(".site-atmosphere");
      if (bg)
        bg.style.backgroundImage = `linear-gradient(to bottom,${stops.join(",")})`;
      const chapter = el.querySelector<HTMLElement>(".lineage-chapter");
      const thread = el.querySelector<SVGElement>(".global-thread");
      if (thread) {
        if (chapter) {
          thread.style.clipPath = `inset(${chapter.offsetTop}px 0 ${Math.max(0, el.offsetHeight - chapter.offsetTop - chapter.offsetHeight)}px 0)`;
        } else thread.style.display = "none";
      }
      el.classList.add("has-atmosphere");
      setFields((old) =>
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
  }, [root, path]);
  useEffect(() => {
    if (
      motionPaused ||
      !fields.length ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const context = gsap.context(() => {
        gsap.utils
          .toArray<HTMLElement>(".field-hero,.field-dark")
          .forEach((field) => {
            gsap.fromTo(
              field.querySelector(".light-one"),
              { yPercent: 9, scale: 0.95 },
              {
                yPercent: -7,
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                  trigger: field,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });
      }, lights);
      return () => context.revert();
    });
    return () => mm.revert();
  }, [fields, motionPaused]);
  return (
    <>
      <div className="site-atmosphere" aria-hidden="true" />
      <div ref={lights} className="scene-lights" aria-hidden="true">
        {fields.map((f, i) => (
          <div
            key={i}
            className={`light-field field-${f.kind} field-${f.side} ${f.dark ? "field-dark" : ""}`}
            style={{ top: f.top, height: f.height }}
          >
            <div className="ambient-light light-one" />
            <div className="ambient-light light-two" />
          </div>
        ))}
      </div>
      <div className="atmosphere-texture" aria-hidden="true" />
    </>
  );
}
