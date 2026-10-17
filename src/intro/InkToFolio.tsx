import { useCallback, useLayoutEffect, useRef, useState } from "react";
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

if (typeof window !== "undefined") {
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
}
function FluidInk({ onUnavailable }: { onUnavailable: () => void }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const tank = useRef<ReturnType<typeof createInkTank>>(null);
  useLayoutEffect(() => {
    if (!canvas.current) return;
    try {
      tank.current = createInkTank(canvas.current, width, height);
    } catch {
      onUnavailable();
      return;
    }
    if (!tank.current) onUnavailable();
    const lost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    const el = canvas.current;
    el.addEventListener("webglcontextlost", lost);
    return () => {
      el.removeEventListener("webglcontextlost", lost);
      tank.current?.destroy();
      tank.current = null;
    };
  }, [width, height, onUnavailable]);
  useLayoutEffect(() => {
    tank.current?.draw(frame);
  }, [frame, width, height]);
  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}
export type IntroProps = { mobile: boolean };
export function InkToFolio({ mobile = false }: IntroProps) {
  const frame = useCurrentFrame();
  const [unavailable, setUnavailable] = useState(false);
  const fail = useCallback(() => setUnavailable(true), []);
  const reveal = interpolate(frame, [0, 26], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Each source remains distinct; no clinical outcome is animated.
  if (unavailable)
    return (
      <AbsoluteFill style={{ background: "#281d34" }}>
        <Img
          src={staticFile(
            mobile
              ? "media/intro-ink-mobile.webp"
              : "media/intro-ink-desktop.webp",
          )}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill
      style={{ background: "#281d34", color: "#f4f1ea", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 1 }}>
        <FluidInk onUnavailable={fail} />
      </div>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: mobile ? "100px 80px" : "60px 200px",
          boxSizing: "border-box",
        }}
      >
        <Img
          src={staticFile("brand/assets/logo/rxlineage-horizontal-reverse.svg")}
          style={{
            width: mobile ? 590 : 560,
            height: "auto",
            transform: `translateY(${(1 - reveal) * 6}px)`,
          }}
        />
        <p
          style={{
            fontFamily: "Rx Newsreader, Georgia, serif",
            fontSize: mobile ? 94 : 78,
            lineHeight: 1.03,
            letterSpacing: "-.025em",
            textAlign: "center",
            fontWeight: 400,
            margin: mobile ? "64px 0 0" : "45px 0 0",
            maxWidth: mobile ? 800 : 1200,
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 18}px)`,
          }}
        >
          Every history
          <br style={{ display: mobile ? "initial" : "none" }} /> has a{" "}
          <em style={{ color: "#c3a18b", fontWeight: 400 }}>source.</em>
        </p>
        <span
          style={{
            fontFamily: "Rx Mono, monospace",
            fontSize: mobile ? 25 : 17,
            letterSpacing: ".15em",
            marginTop: mobile ? 46 : 32,
            color: "#c5b8cd",
            opacity: reveal,
          }}
        >
          RESEARCH-STAGE CONCEPT
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
