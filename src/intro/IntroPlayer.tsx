import React, { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { InkToFolio } from "./InkToFolio";
export default function IntroPlayer({
  mobile,
  paused,
}: {
  mobile: boolean;
  paused: boolean;
}) {
  const ref = useRef<PlayerRef>(null);
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false),
    [ended, setEnded] = useState(false),
    [frame, setFrame] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setEnded(false);
    setManualPause(false);
    setFrame(0);
  }, [mobile]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-90px 0px 0px 0px" },
    );
    observer.observe(el);
    const visibility = () =>
      setVisible(
        document.visibilityState === "visible" &&
          el.getBoundingClientRect().bottom > 90 &&
          el.getBoundingClientRect().top < innerHeight,
      );
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
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
  return (
    <div
      className="intro-runtime"
      ref={root}
      data-playing={playing}
      data-frame={frame}
    >
      <div className="intro-canvas" aria-hidden="true">
        <Player
          key={mobile ? "mobile" : "desktop"}
          ref={ref}
          component={InkToFolio}
          inputProps={{ mobile }}
          durationInFrames={180}
          fps={30}
          compositionWidth={mobile ? 1080 : 1920}
          compositionHeight={mobile ? 1260 : 800}
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
          onClick={() => {
            if (ended) {
              ref.current?.seekTo(0);
              setEnded(false);
              setManualPause(false);
            } else setManualPause(!manualPause);
          }}
          aria-label={
            ended ? "Replay intro" : playing ? "Pause intro" : "Play intro"
          }
        >
          {ended ? "Replay" : playing ? "Pause" : "Play"}{" "}
          <span aria-hidden="true">{ended ? "↻" : playing ? "Ⅱ" : "▷"}</span>
        </button>
        <span className="intro-time" aria-hidden="true">
          {Math.min(frame / 30, 6).toFixed(1)} / 6.0
        </span>
      </div>
    </div>
  );
}
