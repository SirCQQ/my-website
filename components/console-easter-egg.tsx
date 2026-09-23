"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

/**
 * A small banner for anyone who opens devtools out of curiosity. Runs once
 * per full page load (this component lives in the root layout, which
 * persists across client-side navigations) — no state, so nothing here
 * trips the set-state-in-effect rule.
 */
export function ConsoleEasterEgg() {
  useEffect(() => {
    const badge = "font-family:monospace;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;background:#0f9d68;color:#fff;";
    const role = "font-family:monospace;padding:4px 8px;border-radius:0 4px 4px 0;background:#111;color:#0f9d68;";
    const line = "font-family:monospace;color:#737373;";

    console.log(`%c ${siteConfig.name} %c Full-Stack Developer `, badge, role);
    console.log("%cLooking at the source instead of the page — respect.", line);
    console.log("%cTip: press Cmd+K (or Ctrl+K) for a command palette.", line);
    console.log(`%cSay hi: ${siteConfig.email}`, line);
  }, []);

  return null;
}
