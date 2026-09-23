"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "reduce-motion";

type Listener = () => void;
let listeners: Listener[] = [];

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function setStoredReduceMotion(value: boolean) {
  localStorage.setItem(STORAGE_KEY, String(value));
  listeners.forEach((listener) => listener());
}

type MotionContextValue = {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.toggleAttribute("data-reduce-motion", reduceMotion);
  }, [reduceMotion]);

  // No MotionConfig wrapper here on purpose: motion/react only reads its
  // reducedMotion setting once, at mount, so it can't react to this toggle
  // changing later anyway (see project-card.tsx / timeline-item.tsx, which
  // read reduceMotion from this context directly and remount themselves).
  // Wrapping the whole app would also force every page to load motion/react,
  // even pages with no animated content.
  return (
    <MotionContext.Provider
      value={{ reduceMotion, setReduceMotion: setStoredReduceMotion }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPreference() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotionPreference must be used within MotionProvider");
  }
  return context;
}
