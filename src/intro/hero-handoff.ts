/** Finite, interruptible entrance. Native scrolling is never intercepted. */
export function startHeroHandoff(runtime: HTMLElement, hero: HTMLElement) {
  const startY = window.scrollY;
  const duration = 3200;
  const hold = 400;
  let request = 0;
  let elapsed = 0;
  let previous = 0;
  let finished = false;
  runtime.dataset.introHandoff = "holding";
  runtime.dataset.handoffDuration = String(duration);

  const release = () => {
    cancelAnimationFrame(request);
    window.removeEventListener("wheel", interrupt);
    window.removeEventListener("touchstart", interrupt);
    window.removeEventListener("pointerdown", interrupt);
    window.removeEventListener("keydown", key);
    window.removeEventListener("resize", interrupt);
    document.removeEventListener("visibilitychange", visibility);
  };
  const interrupt = () => {
    if (finished) return;
    finished = true;
    runtime.dataset.introHandoff = "interrupted";
    release();
  };
  const key = (event: KeyboardEvent) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Tab",
        "Escape",
      ].includes(event.key)
    )
      interrupt();
  };
  const visibility = () => {
    if (document.visibilityState !== "visible") interrupt();
  };
  const targetY = () => {
    const padding =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
      0;
    const margin = parseFloat(getComputedStyle(hero).scrollMarginTop) || 0;
    return window.scrollY + hero.getBoundingClientRect().top - padding - margin;
  };
  const destination = targetY();
  const tick = (now: number) => {
    if (finished) return;
    if (!previous) previous = now;
    elapsed += Math.min(50, now - previous);
    previous = now;
    const progress = Math.max(0, Math.min(1, (elapsed - hold) / duration));
    // Smootherstep has zero velocity and acceleration at both ends.
    const ease = progress ** 3 * (progress * (progress * 6 - 15) + 10);
    runtime.dataset.handoffProgress = progress.toFixed(3);
    runtime.dataset.introHandoff = elapsed < hold ? "holding" : "travelling";
    if (elapsed >= hold) {
      window.scrollTo({
        top: startY + (destination - startY) * ease,
        behavior: "instant",
      });
    }
    if (progress < 1) request = requestAnimationFrame(tick);
    else {
      finished = true;
      runtime.dataset.introHandoff = "entered";
      hero.focus({ preventScroll: true });
      release();
    }
  };
  window.addEventListener("wheel", interrupt, { passive: true });
  window.addEventListener("touchstart", interrupt, { passive: true });
  window.addEventListener("pointerdown", interrupt, { passive: true });
  window.addEventListener("keydown", key);
  window.addEventListener("resize", interrupt, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  request = requestAnimationFrame(tick);
  return interrupt;
}
