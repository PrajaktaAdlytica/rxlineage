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
function FluidInk() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null),
    tank = useRef<ReturnType<typeof createInkTank>>(null);
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
    tank.current?.draw(frame);
  }, [frame, width, height]);
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
export type IntroProps = { mobile: boolean };
export function InkToFolio({ mobile = false }: IntroProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const logoReveal = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleReveal = interpolate(frame, [4, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const noteReveal = interpolate(frame, [14, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ background: "#211a29", color: "#f4f1ea", overflow: "hidden" }}
    >
      <FluidInk />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          padding: mobile ? "120px 75px" : "100px 120px",
          transform: `translate(${mobile ? width * 0.075 : 0}px,${height * (mobile ? -0.015 : 0.025)}px)`,
        }}
      >
        <Img
          src={staticFile(
            "brand/assets/logo/rxlineage-horizontal-reverse-accent.svg",
          )}
          style={{
            width: mobile ? 720 : 650,
            height: "auto",
            transform: `translateY(${(1 - logoReveal) * 6}px)`,
          }}
        />
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
            opacity: titleReveal,
            transform: `translateY(${(1 - titleReveal) * 14}px)`,
          }}
        >
          Every history
          <br style={{ display: mobile ? "initial" : "none" }} /> has a{" "}
          <em style={{ color: "#c4a28c", fontWeight: 400 }}>source.</em>
        </p>
        <span
          style={{
            fontFamily: "Rx Mono, monospace",
            fontSize: mobile ? 30 : 18,
            letterSpacing: ".14em",
            marginTop: mobile ? 50 : 44,
            color: "#c5b8cd",
            opacity: noteReveal,
          }}
        >
          RESEARCH-STAGE CONCEPT
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
