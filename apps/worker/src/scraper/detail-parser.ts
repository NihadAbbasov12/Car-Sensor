import * as cheerio from "cheerio";
import { config } from "../config";
import { ensureAbsoluteUrl, loadJsonLd, normalizeWhitespace } from "./helpers";
import type { RawDetailCar, RawListingCar } from "./types";

interface ProductJsonLd {
  "@type"?: string;
  name?: string;
  color?: string;
  brand?: Array<{ name?: string }>;
  offers?: Array<{ price?: string }>;
}

export function parseDetailPage(html: string, listingCar: RawListingCar): RawDetailCar {
  const $ = cheerio.load(html);
  const pageText = normalizeWhitespace($.text());

  const detailTitle =
    normalizeWhitespace($("h1").first().text()) ||
    normalizeWhitespace($('meta[property="og:title"]').attr("content")) ||
    null;

  const attributes: Record<string, string> = {};

  $(".specWrap__box").each((_, element) => {
    const label = normalizeWhitespace($(element).find(".specWrap__box__title").text());
    const value = normalizeWhitespace(
      $(element).find(".specWrap__box__num, .specWrap__boxDetail, .specWrap__boxEraName, .specWrap__boxUnit").text(),
    );
    if (label && value) {
      attributes[label] = value;
    }
  });

  $(".defaultTable tr").each((_, row) => {
    const label = normalizeWhitespace($(row).find("th").first().text());
    const value = normalizeWhitespace($(row).find("td").first().text());
    if (label && value) {
      attributes[label] ??= value;
    }
  });

  const textSequences: Array<[label: string, nextLabel: string]> = [
    ["\u30dc\u30c7\u30a3\u30bf\u30a4\u30d7", "\u99c6\u52d5\u65b9\u5f0f"],
    ["\u99c6\u52d5\u65b9\u5f0f", "\u8272"],
    ["\u30df\u30c3\u30b7\u30e7\u30f3", "\u6392\u6c17\u91cf"],
    ["\u6392\u6c17\u91cf", "\u4e57\u8eca\u5b9a\u54e1"],
    ["\u30a8\u30f3\u30b8\u30f3\u7a2e\u5225", "\u30c9\u30a2\u6570"],
  ];

  for (const [label, nextLabel] of textSequences) {
    if (attributes[label]) {
      continue;
    }

    const match = pageText.match(new RegExp(`${label}\\s+(.+?)\\s+${nextLabel}`));
    if (match?.[1]) {
      attributes[label] = match[1].trim();
    }
  }

  const galleryImages = $('a.js-photo[data-photohq], a.js-photo[data-photo]')
    .map((_, element) =>
      ensureAbsoluteUrl(config.SCRAPER_BASE_URL, $(element).attr("data-photohq") ?? $(element).attr("data-photo")),
    )
    .get()
    .filter((url): url is string => Boolean(url));

  const fallbackImages = $("#js-mainPhoto, .detailSlider img")
    .map((_, element) =>
      ensureAbsoluteUrl(config.SCRAPER_BASE_URL, $(element).attr("data-photohq") ?? $(element).attr("src")),
    )
    .get()
    .filter((url): url is string => Boolean(url));

  const jsonLdBlocks = loadJsonLd<ProductJsonLd>(html);
  const product = jsonLdBlocks.find((block) => block["@type"] === "Product");
  const titleParts = (detailTitle ?? listingCar.title).split(" ");

  return {
    ...listingCar,
    detailTitle,
    brandRaw: product?.brand?.[0]?.name ?? listingCar.brandRaw ?? titleParts[0] ?? null,
    modelRaw: product?.brand?.[1]?.name ?? listingCar.modelRaw ?? titleParts[1] ?? null,
    priceRaw:
      listingCar.priceRaw ??
      normalizeWhitespace($(".basePrice__price").text()) ??
      product?.offers?.[0]?.price ??
      null,
    totalPriceRaw: listingCar.totalPriceRaw ?? normalizeWhitespace($(".totalPrice__price").text()) ?? null,
    engineCcRaw: attributes["\u6392\u6c17\u91cf"] ?? listingCar.engineCcRaw,
    transmissionRaw: attributes["\u30df\u30c3\u30b7\u30e7\u30f3"] ?? listingCar.transmissionRaw,
    bodyTypeRaw: attributes["\u30dc\u30c7\u30a3\u30bf\u30a4\u30d7"] ?? null,
    driveRaw: attributes["\u99c6\u52d5\u65b9\u5f0f"] ?? null,
    fuelTypeRaw: attributes["\u71c3\u6599"] ?? attributes["\u30a8\u30f3\u30b8\u30f3\u7a2e\u5225"] ?? null,
    colorRaw: product?.color ?? attributes["\u8272"] ?? null,
    locationRaw: attributes["\u5730\u57df"]?.split("/")[0]?.trim() ?? null,
    imageUrls: [...new Set([...listingCar.imageUrls, ...galleryImages, ...fallbackImages])],
    attributes,
  };
}
