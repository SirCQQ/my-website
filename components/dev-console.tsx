"use client";

import Script from "next/script";

declare global {
  interface Window {
    eruda?: { init: () => void };
  }
}

/**
 * Dev-only on-page console (via eruda) — lets you see console/network errors
 * directly on a phone with no computer or remote-debugging setup. Renders
 * nothing outside development, so it never ships to production.
 */
export function DevConsole() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda"
      strategy="afterInteractive"
      onLoad={() => window.eruda?.init()}
    />
  );
}
