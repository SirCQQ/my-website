import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Lets the dev server's JS/HMR assets load when testing on a phone —
  // without this, Next.js blocks those cross-origin requests by default in
  // dev, so the page loads as static HTML with no working JavaScript at all
  // (every button appears but does nothing). Has no effect on production
  // builds. "192.168.*.*"/"10.*.*.*" cover a phone on the same home wifi as
  // a locally-run dev server; "13.12.11.52" is this sandboxed dev
  // environment's own public tunnel address (confirmed from the actual
  // blocked-origin warning) — if that ever changes, add the new one here.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "13.12.11.52"],
};

export default withNextIntl(nextConfig);
