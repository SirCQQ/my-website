/**
 * Fetches a Google Font's TTF bytes server-side. Pass `text` to subset to
 * only the characters actually used (smaller, faster) — omit it to fetch
 * the full character set (safer when the full text isn't known upfront,
 * e.g. arbitrary CV content with Romanian diacritics).
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text?: string
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ family: `${family}:wght@${weight}` });
  if (text) params.set("text", text);

  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?${params.toString()}`)
  ).text();
  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/
  );

  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) return response.arrayBuffer();
  }

  throw new Error(`Failed to load Google Font "${family}" (weight ${weight})`);
}
