export { cn } from "cn"

/** Strips diacritics (ă, â, î, ș, ț, and general Latin accents) so text
 * can be compared/searched regardless of whether they were typed. */
export function stripDiacritics(value: string): string {
  const ROMANIAN_DIACRITICS: Record<string, string> = {
    ă: "a", Ă: "A",
    â: "a", Â: "A",
    î: "i", Î: "I",
    ș: "s", Ș: "S",
    ş: "s", Ş: "S",
    ț: "t", Ț: "T",
    ţ: "t", Ţ: "T",
  }

  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ăĂâÂîÎșȘşŞțȚţŢ]/g, (char) => ROMANIAN_DIACRITICS[char] ?? char)
}
