import { Laptop, Moon, Sun, type LucideIcon } from "lucide-react";

export type ThemeOption = {
  value: string;
  icon: LucideIcon;
};

/**
 * Every theme available to the switcher. To add a new theme later:
 *   1. add a token block for it in app/globals.css (see comment there)
 *   2. add its name to the `themes` array in components/theme-provider.tsx
 *   3. add an entry here so it shows up in the switcher
 *   4. add a matching label under `theme.<value>` in every messages/*.json file
 * No other code needs to change.
 */
export const THEMES: ThemeOption[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
];
