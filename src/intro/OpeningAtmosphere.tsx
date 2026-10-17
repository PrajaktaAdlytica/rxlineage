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
    const site = main.closest<HTMLElement>(".site");
    if (site) site.dataset.openingNav = "managed";
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
      const smooth = (start: number, end: number) => {
        const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        return t ** 3 * (t * (t * 6 - 15) + 10);
      };
      // Keep the same ink visible until the hero has settled. The identity
      // clears first; the product scene enters through the remaining ink.
      el.style.setProperty(
        "--opening-ink-opacity",
        String(1 - smooth(0.08, 1) * 0.82),
      );
      main.style.setProperty(
        "--intro-copy-opacity",
        String(1 - smooth(0.02, 0.65)),
      );
      main.style.setProperty(
        "--opening-hero-opacity",
        String(smooth(0.2, 0.92)),
      );
      // The navigation is already docked at the top. Reveal it only as the
      // hero arrives, instead of carrying a horizontal bar across the ink.
      site?.style.setProperty("--opening-nav-opacity", String(smooth(0.78, 1)));
      site?.style.setProperty(
        "--opening-nav-visibility",
        progress > 0.78 ? "visible" : "hidden",
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
      main.style.removeProperty("--opening-hero-opacity");
      site?.style.removeProperty("--opening-nav-opacity");
      site?.style.removeProperty("--opening-nav-visibility");
      if (site) delete site.dataset.openingNav;
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
