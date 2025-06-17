import Cookies from "js-cookie";

const COOKIE_KEY = "poap_hashes";

export function getPoapHashes(): string[] {
  if (typeof window === "undefined") return [];
  const raw = Cookies.get(COOKIE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addPoapHashes(hashes: string[]) {
  if (typeof window === "undefined") return;
  const current = getPoapHashes();
  const merged = Array.from(new Set([...current, ...hashes]));
  Cookies.set(COOKIE_KEY, JSON.stringify(merged), { expires: 7 });
}

export function usePoapHash(): string | null {
  const hashes = getPoapHashes();
  return hashes.length > 0 ? hashes[0] : null;
}

export function removePoapHash(hash: string) {
  if (typeof window === "undefined") return;
  const hashes = getPoapHashes().filter((h) => h !== hash);
  Cookies.set(COOKIE_KEY, JSON.stringify(hashes), { expires: 7 });
}