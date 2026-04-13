import * as cheerio from "cheerio";

export function normalizeWhitespace(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

export function ensureAbsoluteUrl(baseUrl: string, maybeRelative: string | undefined) {
  if (!maybeRelative) {
    return null;
  }

  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://")) {
    return maybeRelative;
  }

  if (maybeRelative.startsWith("//")) {
    return `https:${maybeRelative}`;
  }

  return new URL(maybeRelative, baseUrl).toString();
}

export function loadJsonLd<T>(html: string): T[] {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]')
    .map((_, element) => $(element).text())
    .get();

  const parsed: T[] = [];

  for (const script of scripts) {
    try {
      const value = JSON.parse(script) as T | T[];
      if (Array.isArray(value)) {
        parsed.push(...value);
      } else {
        parsed.push(value);
      }
    } catch {
      // ignore malformed blocks
    }
  }

  return parsed;
}

export function extractSourceId(url: string) {
  const match = url.match(/detail\/([A-Z0-9]+)\//i);
  return match?.[1] ?? url;
}
