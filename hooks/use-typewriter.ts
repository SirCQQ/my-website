/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

const TYPING_SPEED_MS = 55;
const DELETING_SPEED_MS = 30;
const PAUSE_AFTER_TYPED_MS = 1800;
const PAUSE_AFTER_DELETED_MS = 300;

export function useTypewriter(words: string[]): string {
  const [text, setText] = useState(words[0] ?? "");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setText(words[0]);
      return;
    }

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
  }, [text, isDeleting, wordIndex, words]);

  return text;
}
