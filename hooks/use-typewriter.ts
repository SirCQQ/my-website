"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useMotionPreference } from "@/components/motion-provider";

const TYPING_SPEED_MS = 55;
const DELETING_SPEED_MS = 30;
const PAUSE_AFTER_TYPED_MS = 1800;
const PAUSE_AFTER_DELETED_MS = 300;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

export function useTypewriter(words: string[]): string {
  const osReducedMotion = usePrefersReducedMotion();
  const { reduceMotion: manualReducedMotion } = useMotionPreference();
  const prefersReducedMotion = osReducedMotion || manualReducedMotion;
  const [text, setText] = useState(words[0] ?? "");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0 || prefersReducedMotion) return;

    const currentWord = words[wordIndex % words.length];
    const atFullWord = text === currentWord;
    const atEmpty = text === "";

    let delay = isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS;
    if (atFullWord && !isDeleting) delay = PAUSE_AFTER_TYPED_MS;
    if (atEmpty && isDeleting) delay = PAUSE_AFTER_DELETED_MS;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (atEmpty) {
          setIsDeleting(false);
          setWordIndex((index) => (index + 1) % words.length);
        } else {
          setText(currentWord.slice(0, text.length - 1));
        }
      } else if (atFullWord) {
        setIsDeleting(true);
      } else {
        setText(currentWord.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, prefersReducedMotion]);

  if (prefersReducedMotion) return words[words.length - 1] ?? words[0] ?? "";
  return text;
}
