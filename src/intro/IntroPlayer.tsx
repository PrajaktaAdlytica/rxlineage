import React, { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { InkToFolio } from "./InkToFolio";
export default function IntroPlayer({
  mobile,
  paused,
  backdropTarget,
}: {
  mobile: boolean;
  paused: boolean;
  backdropTarget?: HTMLElement | null;
}) {
  const ref = useRef<PlayerRef>(null);
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false),
    [ended, setEnded] = useState(false),
    [frame, setFrame] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: mobile ? 1080 : 1920,
    height: mobile ? 1920 : 1080,
  });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const size = () => {
      const box = el.getBoundingClientRect();
      if (box.width > 0 && box.height > 0) {
        const width = mobile ? 1080 : 1920;
        setDimensions({
          width,
          height: Math.round((width * box.height) / box.width),
        });
      }
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobile]);
  useEffect(() => {
    setEnded(false);
    setManualPause(false);
    setFrame(0);
  }, [mobile]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observed = backdropTarget?.closest(".opening-atmosphere") || el;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(
          entry.isIntersecting && document.visibilityState === "visible",
        ),
      { threshold: 0, rootMargin: "-90px 0px 0px 0px" },
    );
    observer.observe(observed);
    const visibility = () =>
      setVisible(
        document.visibilityState === "visible" &&
          observed.getBoundingClientRect().bottom > 90 &&
          observed.getBoundingClientRect().top < innerHeight,
      );
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [backdropTarget]);
  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const play = () => setPlaying(true),
      pause = () => setPlaying(false),
      end = () => setEnded(true);
    const update = (e: { detail: { frame: number } }) =>
      setFrame(e.detail.frame);
    player.addEventListener("play", play);
    player.addEventListener("pause", pause);
    player.addEventListener("ended", end);
    player.addEventListener("frameupdate", update);
    return () => {
      player.removeEventListener("play", play);
      player.removeEventListener("pause", pause);
      player.removeEventListener("ended", end);
      player.removeEventListener("frameupdate", update);
    };
  }, [mobile]);
  useEffect(() => {
    if (paused || !visible || manualPause || ended) ref.current?.pause();
    else void ref.current?.play();
  }, [paused, visible, manualPause, ended, mobile]);
  const ambientActive = !paused && visible && !manualPause;
  return (
    <div
      className="intro-runtime"
      ref={root}
      data-playing={ambientActive}
      data-timeline-playing={playing}
      data-frame={frame}
    >
      <div className="intro-canvas" aria-hidden="true">
        <Player
          key={mobile ? "mobile" : "desktop"}
          ref={ref}
          component={InkToFolio}
          inputProps={{
            mobile,
            realtime: true,
            active: ambientActive,
            backdropTarget,
          }}
          durationInFrames={180}
          fps={30}
          compositionWidth={dimensions.width}
          compositionHeight={dimensions.height}
          controls={false}
          initiallyMuted
          numberOfSharedAudioTags={0}
          loop={false}
          moveToBeginningWhenEnded={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="intro-controls">
        <button
          type="button"
          disabled={paused}
          onClick={() => setManualPause(!manualPause)}
          aria-label={
            ambientActive ? "Pause intro motion" : "Play intro motion"
          }
        >
          {ambientActive ? "Pause" : "Play"}{" "}
          <span aria-hidden="true">{ambientActive ? "Ⅱ" : "▷"}</span>
        </button>
        {ended && (
          <button
            type="button"
            className="intro-replay"
            aria-label="Replay intro"
            title="Replay intro"
            onClick={() => {
              ref.current?.seekTo(0);
              setEnded(false);
              setManualPause(false);
            }}
          >
            <span aria-hidden="true">↻</span>
          </button>
        )}
      </div>
      <span className="intro-stir-hint">Move to stir the ink</span>
    </div>
  );
}
