import { useEffect, useRef } from "react";

/** One viewport-sized ink surface, retained across the introduction and hero. */
export function OpeningAtmosphere({
  onTarget,
}: {
  onTarget: (el: HTMLDivElement | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    const main = el?.parentElement;
    const intro = main?.querySelector<HTMLElement>(".rx-intro");
    const hero = main?.querySelector<HTMLElement>("#home-hero");
    if (!el || !main || !intro || !hero) return;
    let request = 0;
    const update = () => {
      request = 0;
      const rect = intro.getBoundingClientRect();
      const end = hero.offsetTop + hero.offsetHeight;
      el.style.height = `${end}px`;
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height)),
      );
      // Clear the reading lane as the real workflow arrives. This is a temporal
      // dissolve of the same scene, not a gradient band between sections.
      const t = Math.max(0, Math.min(1, (progress - 0.05) / 0.75));
      const eased = t * t * (3 - 2 * t);
      el.style.setProperty("--opening-ink-opacity", String(1 - eased * 0.88));
      main.style.setProperty(
        "--intro-copy-opacity",
        String(1 - Math.min(1, progress / 0.7)),
      );
    };
    const schedule = () => {
      if (!request) request = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(intro);
    ro.observe(hero);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(request);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      main.style.removeProperty("--intro-copy-opacity");
    };
  }, []);
  return (
    <div ref={root} className="opening-atmosphere" aria-hidden="true">
      <div className="opening-atmosphere-viewport">
        <div ref={onTarget} className="opening-ink-art" />
      </div>
    </div>
  );
}
