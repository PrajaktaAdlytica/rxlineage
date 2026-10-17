import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Easing,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createPortal } from "react-dom";
import { loadFont } from "@remotion/fonts";
import { createInkTank } from "./ink-tank";
if (typeof window !== "undefined")
  void Promise.all([
    loadFont({
      family: "Rx Newsreader",
      url: staticFile("brand/assets/fonts/Newsreader-Variable.woff2"),
      weight: "400",
    }),
    loadFont({
      family: "Rx Newsreader",
      url: staticFile("brand/assets/fonts/Newsreader-Italic-Variable.woff2"),
      weight: "400",
      style: "italic",
    }),
    loadFont({
      family: "Rx Mono",
      url: staticFile("brand/assets/fonts/IBMPlexMono-Regular.woff2"),
    }),
  ]);
function FluidInk({
  realtime,
  active,
}: {
  realtime: boolean;
  active: boolean;
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null),
    tank = useRef<ReturnType<typeof createInkTank>>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const latestFrame = useRef(frame);
  latestFrame.current = frame;
  const [painted, setPainted] = useState(false);
  const src = staticFile(
    height / width > 1.35
      ? "media/ink-to-folio-portrait-v2.webp"
      : "media/ink-to-folio-landscape-v2.webp",
  );
  useLayoutEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let alive = true;
    setPainted(false);
    const image = new Image();
    image.onload = () => {
      if (!alive) return;
      try {
        tank.current = createInkTank(el, width, height, image);
        tank.current?.draw(latestFrame.current);
        setPainted(Boolean(tank.current));
      } catch {
        setPainted(false);
      }
    };
    image.src = src;
    const lost = (event: Event) => {
      event.preventDefault();
      setPainted(false);
      tank.current?.destroy();
      tank.current = null;
    };
    el.addEventListener("webglcontextlost", lost);
    return () => {
      alive = false;
      image.onload = null;
      el.removeEventListener("webglcontextlost", lost);
      tank.current?.destroy();
      tank.current = null;
    };
  }, [width, height, src]);
  useLayoutEffect(() => {
    if (!realtime) tank.current?.draw(frame);
  }, [frame, width, height, realtime]);
  useLayoutEffect(() => {
    if (!realtime || !active || !painted) return;
    let request = 0,
      last = 0;
    const tick = (now: number) => {
      if (!last) last = now;
      const dt = (now - last) / 1000;
      if (dt >= 1 / 60 - 0.001) {
        tank.current?.tick(Math.min(0.05, dt));
        last = now;
      }
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [realtime, active, painted]);
  useLayoutEffect(() => {
    if (!realtime) return;
    const el = canvas.current,
      stage =
        el?.closest<HTMLElement>(".opening-atmosphere")?.parentElement ||
        el?.closest<HTMLElement>(".rx-intro");
    if (!el || !stage) return;
    const move = (e: PointerEvent) => {
      // Native touch scrolling takes priority; mouse and pen need no click.
      if (!activeRef.current || e.pointerType === "touch") return;
      if ((e.target as Element).closest("a,button")) {
        tank.current?.leave();
        return;
      }
      const box = el.getBoundingClientRect();
      tank.current?.pointer(
        (e.clientX - box.left) / box.width,
        (e.clientY - box.top) / box.height,
      );
      el.dataset.pointerSamples = String(
        Number(el.dataset.pointerSamples || 0) + 1,
      );
    };
    const leave = () => tank.current?.leave();
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave, { passive: true });
    stage.addEventListener("pointercancel", leave, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      stage.removeEventListener("pointercancel", leave);
    };
  }, [realtime]);
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: painted ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
}
export type IntroProps = {
  mobile: boolean;
  realtime?: boolean;
  active?: boolean;
  backdropTarget?: HTMLElement | null;
};
export function InkToFolio({
  mobile = false,
  realtime = false,
  active = true,
  backdropTarget,
}: IntroProps) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const reveal = (start: number, end: number) =>
    interpolate(frame, [start * fps, end * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  const leftReveal = reveal(1.2, 1.95);
  const rightReveal = reveal(1.65, 2.5);
  const lockup = reveal(2.5, 3.4);
  const wordmarkReveal = reveal(2.55, 3.5);
  const prefixReveal = reveal(3.5, 4.2);
  const sourceReveal = reveal(4.55, 5.0);
  const noteReveal = reveal(5.15, 5.75);
  const logoWidth = mobile ? 720 : 650;
  const logoHeight = (logoWidth * 100) / 323;
  const symbolCenter = (logoWidth * 49.04) / 323;
  const symbolOffset = (logoWidth / 2 - symbolCenter) * (1 - lockup);
  const prefixStyle = {
    display: "inline-block",
    translate: `0 ${(1 - prefixReveal) * 18}px`,
  };
  return (
    <AbsoluteFill
      style={{
        background: backdropTarget ? "transparent" : "#211a29",
        color: "#f4f1ea",
        overflow: "hidden",
      }}
    >
      {backdropTarget ? (
        createPortal(
          <FluidInk realtime={realtime} active={active} />,
          backdropTarget,
        )
      ) : (
        <FluidInk realtime={realtime} active={active} />
      )}
      <AbsoluteFill
        className="intro-identity"
        style={{
          opacity: realtime ? "var(--intro-copy-opacity, 1)" : 1,
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          padding: mobile ? "120px 75px" : "100px 120px",
          transform: `translate(${mobile ? width * 0.075 : 0}px,${height * (mobile ? -0.015 : 0.025)}px)`,
        }}
      >
        <div
          className="intro-logo-lockup"
          style={{
            position: "relative",
            width: logoWidth,
            height: logoHeight,
            flexShrink: 0,
            translate: `0 ${(1 - lockup) * (mobile ? 185 : 90)}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: `${symbolCenter}px 50%`,
              translate: `${symbolOffset}px 0`,
              scale: 1 + (1 - lockup) * 0.65,
            }}
          >
            <Img
              data-reveal-part="limestone"
              src={staticFile(
                "brand/assets/logo/rxlineage-intro-limestone.svg",
              )}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: leftReveal,
                clipPath: `inset(${(1 - leftReveal) * 100}% 0 0 0)`,
                filter: `blur(${(1 - leftReveal) * 3}px)`,
              }}
            />
            <Img
              data-reveal-part="lavender"
              src={staticFile("brand/assets/logo/rxlineage-intro-lavender.svg")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: rightReveal,
                clipPath: `inset(0 0 ${(1 - rightReveal) * 100}% 0)`,
                filter: `blur(${(1 - rightReveal) * 3}px)`,
              }}
            />
          </div>
          <Img
            data-reveal-part="wordmark"
            src={staticFile("brand/assets/logo/rxlineage-intro-wordmark.svg")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: wordmarkReveal,
              clipPath: `inset(0 ${(1 - wordmarkReveal) * 69.58}% 0 0)`,
              translate: `0 ${(1 - wordmarkReveal) * 8}px`,
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "Rx Newsreader, Georgia, serif",
            fontSize: mobile ? 100 : 80,
            lineHeight: 1.06,
            letterSpacing: "-.025em",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: mobile ? 860 : 1220,
            margin: mobile ? "42px 0 0" : "24px 0 0",
            textShadow: "0 2px 14px #211a29",
          }}
        >
          <span data-reveal-part="prefix" style={{ opacity: prefixReveal }}>
            <span style={prefixStyle}>Every history</span>
            <br style={{ display: mobile ? "initial" : "none" }} />{" "}
            <span style={prefixStyle}>has a</span>
          </span>{" "}
          <em
            data-reveal-part="source"
            style={{
              color: "#c4a28c",
              fontWeight: 400,
              display: "inline-block",
              opacity: sourceReveal,
              translate: `0 ${(1 - sourceReveal) * 15}px`,
              filter: `blur(${(1 - sourceReveal) * 4}px)`,
            }}
          >
            source.
          </em>
        </p>
        <span
          style={{
            fontFamily: "Rx Mono, monospace",
            fontSize: mobile ? 30 : 18,
            letterSpacing: ".14em",
            marginTop: mobile ? 50 : 44,
            color: "#c5b8cd",
            background: mobile ? "#211a29e8" : undefined,
            padding: mobile ? "10px 14px" : undefined,
            textShadow: "0 1px 6px #211a29",
            opacity: noteReveal,
          }}
        >
          RESEARCH-STAGE CONCEPT
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
