"use client";

import { useTypewriter } from "@/hooks/use-typewriter";

export function Typewriter({ words }: { words: string[] }) {
  const text = useTypewriter(words);

  return (
    <span className="text-brand">
      {text}
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse motion-reduce:animate-none bg-brand align-middle"
      />
    </span>
  );
}
