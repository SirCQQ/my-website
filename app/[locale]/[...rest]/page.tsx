import { notFound } from "next/navigation";

// Catch-all for any path under a locale that doesn't match a defined route.
// Without this, an unmatched URL never reaches a matched route segment, so
// the nested `not-found.tsx` in `app/[locale]/` never gets a chance to
// render and Next falls back to its bare, unstyled default 404 page.
export default function CatchAllNotFound() {
  notFound();
}
