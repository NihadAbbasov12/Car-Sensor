const bannerHints = [
  "/ml/",
  "SU",
  "logo",
  "banner",
  "ad",
  "nophoto",
  "loading",
  "afterPR",
];

function looksLikeBanner(url: string) {
  const lowered = url.toLowerCase();
  return bannerHints.some((hint) => lowered.includes(hint.toLowerCase()));
}

export function pickPrimaryImage(urls: string[]) {
  if (urls.length === 0) {
    return null;
  }

  const best = urls.find((url) => !looksLikeBanner(url));
  return best ?? urls[0] ?? null;
}

export function filterCarImages(urls: string[]) {
  const filtered = urls.filter((url) => !looksLikeBanner(url));
  return filtered.length > 0 ? filtered : urls;
}

export function prioritizeCarImages(urls: string[]) {
  if (urls.length === 0) {
    return urls;
  }

  const firstRealIndex = urls.findIndex((url) => !looksLikeBanner(url));
  if (firstRealIndex <= 0) {
    return urls;
  }

  const copy = [...urls];
  const [best] = copy.splice(firstRealIndex, 1);
  copy.unshift(best);
  return copy;
}

export function preferSecondImage(urls: string[]) {
  if (urls.length <= 1) {
    return urls;
  }

  const [first, second, ...rest] = urls;
  return [second, first, ...rest];
}

export function formatPrice(price: number | null) {
  return price ? `JPY ${price.toLocaleString()}` : "Price unavailable";
}

export function formatMileage(mileage: number | null) {
  return mileage ? `${mileage.toLocaleString()} km` : "Mileage unavailable";
}

export function formatValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }
  return String(value);
}
