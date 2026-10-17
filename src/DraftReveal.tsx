import React, { useContext, useEffect, useRef, useState } from "react";
import { MotionContext } from "./motion-context";

/** Visual typing only. The full unsent draft remains available to readers. */
export function DraftReveal({ text }: { text: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const paused = useContext(MotionContext);
  const [count, setCount] = useState(text.length);
  useEffect(() => {
    const el = root.current;
    if (
      !el ||
      paused ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCount(text.length);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          let current = 0;
          setCount(0);
          timer = setInterval(() => {
            current += 1;
            setCount(current);
            if (current >= text.length) clearInterval(timer);
          }, 25);
        } else if (!entry.isIntersecting && started) {
          clearInterval(timer);
          setCount(text.length);
        }
      },
      { threshold: 0.35 },
    );
    const visibility = () => {
      if (document.hidden) {
        clearInterval(timer);
        setCount(text.length);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [text, paused]);
  return (
    <span className="draft-reveal" ref={root}>
      <span className="sr-only">{text}</span>
      <span className="draft-measure" aria-hidden="true">
        {text}
      </span>
      <span className="draft-live" aria-hidden="true">
        {text.slice(0, count)}
        {count < text.length && <i className="draft-caret" />}
      </span>
    </span>
  );
}
