"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";

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

  return (
    <MotionContext.Provider
      value={{ reduceMotion, setReduceMotion: setStoredReduceMotion }}
    >
      {/* "user" respects the OS-level prefers-reduced-motion automatically;
          "always" forces every motion/react animation off when the header
          toggle is on, regardless of the OS setting. */}
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
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
