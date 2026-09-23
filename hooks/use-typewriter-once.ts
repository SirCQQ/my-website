"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const DEFAULT_SPEED_MS = 22;

function subscribeNever() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
}

/**
 * Reveals `text` one character at a time as it scrolls into view, once.
 *
 * Before mount (SSR and the first client paint) it always returns the full
 * text, so search engines, no-JS visitors, and hydration all see complete
 * content — no state is ever reset synchronously in an effect. Once
 * mounted, it renders "" until `start` (an in-view check) goes true, then
 * types the text back in via a timer. `skip` disables the effect entirely
 * and always returns the full text (used for reduced motion).
 */
export function useTypewriterOnce(
  text: string,
  {
    start,
    skip = false,
    speed = DEFAULT_SPEED_MS,
    startDelay = 0,
  }: { start: boolean; skip?: boolean; speed?: number; startDelay?: number }
): string {
  const mounted = useMounted();
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (skip || !mounted || !start || typedLength >= text.length) return;

    const delay = typedLength === 0 ? startDelay : speed;
    const timeout = setTimeout(() => {
      setTypedLength((current) => Math.min(current + 1, text.length));
    }, delay);

    return () => clearTimeout(timeout);
  }, [skip, mounted, start, typedLength, text, speed, startDelay]);

  if (skip || !mounted) return text;
  if (!start) return "";
  return text.slice(0, typedLength);
}
