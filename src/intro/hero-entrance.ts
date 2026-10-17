import { gsap } from "gsap";

/** One entrance rhythm: context, sources, difference, accountable reviewer. */
export function createHeroEntrance(root: HTMLElement, stacked: boolean) {
  const hero = root.querySelector<HTMLElement>("#home-hero");
  const scene = hero?.querySelector<HTMLElement>(".opening-scene");
  if (!hero || !scene) return;
  const find = (selector: string) => hero.querySelectorAll(selector);
  hero.dataset.entrance = "waiting";
  scene.dataset.entrance = "waiting";
  const copy = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: hero, start: "top 88%", once: true },
    onStart: () => {
      hero.dataset.entrance = "playing";
    },
    onComplete: () => {
      hero.dataset.entrance = "complete";
    },
  });
  copy
    .from(
      find(".hero-copy > .eyebrow"),
      { y: 12, autoAlpha: 0, duration: 0.7 },
      0,
    )
    .from(find(".hero-copy h1"), { y: 30, autoAlpha: 0, duration: 1.15 }, 0.12)
    .from(
      find(".hero-copy .lead"),
      { y: 18, autoAlpha: 0, duration: 0.85 },
      0.58,
    )
    .from(
      find(".hero-copy .actions > *"),
      { y: 14, autoAlpha: 0, duration: 0.8, stagger: 0.16 },
      0.94,
    )
    .from(
      find(".hero-copy .concept-note"),
      { y: 10, autoAlpha: 0, duration: 0.7 },
      1.32,
    );

  // On a stacked phone layout the evidence is below the first viewport. Let
  // its own visibility start the next beat instead of spending it offscreen.
  const evidence = stacked
    ? gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: scene, start: "top 70%", once: true },
      })
    : copy;
  const offset = stacked ? 0 : 0.32;
  evidence
    .call(
      () => {
        scene.dataset.entrance = "playing";
      },
      [],
      offset,
    )
    .from(
      find(".opening-scene-top"),
      { y: 10, autoAlpha: 0, duration: 0.65 },
      offset,
    )
    .from(
      find(".opening-caption > *"),
      { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.12 },
      offset + 0.08,
    )
    .from(
      find(".opening-scene > .demo-badges"),
      { autoAlpha: 0, duration: 0.5 },
      offset + 0.22,
    )
    .from(
      find(".opening-document"),
      { y: 34, autoAlpha: 0, duration: 1.05, stagger: 0.28 },
      offset + 0.62,
    )
    .from(
      find(".opening-source-link"),
      { y: 8, autoAlpha: 0, duration: 0.6 },
      offset + 1.24,
    )
    .from(
      find(".opening-receipt"),
      { y: 22, autoAlpha: 0, duration: 0.95 },
      offset + 1.5,
    )
    .from(
      find(".opening-reviewer"),
      { y: 12, autoAlpha: 0, duration: 0.8 },
      offset + 1.87,
    )
    .from(
      find(".opening-scene-foot"),
      { y: 8, autoAlpha: 0, duration: 0.65 },
      offset + 2.12,
    )
    .call(() => {
      scene.dataset.entrance = "complete";
    });
  return () => {
    delete hero.dataset.entrance;
    delete scene.dataset.entrance;
  };
}
