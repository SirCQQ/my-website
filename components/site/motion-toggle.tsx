"use client";

import { useSyncExternalStore } from "react";
import { Zap, ZapOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMotionPreference } from "@/components/motion-provider";
import { Button } from "@/components/ui/button";

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

export function MotionToggle() {
  const { reduceMotion, setReduceMotion } = useMotionPreference();
  const t = useTranslations("motion");
  const mounted = useMounted();
  const isReduced = mounted && reduceMotion;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isReduced ? t("enable") : t("disable")}
      aria-pressed={isReduced}
      onClick={() => setReduceMotion(!reduceMotion)}
      className="text-muted-foreground hover:text-foreground"
    >
      {isReduced ? <ZapOff className="size-4" /> : <Zap className="size-4" />}
    </Button>
  );
}
