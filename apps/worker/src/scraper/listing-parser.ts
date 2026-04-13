import * as cheerio from "cheerio";
import { config } from "../config";
import { extractSourceId, loadJsonLd, normalizeWhitespace } from "./helpers";
import type { RawListingCar } from "./types";

interface ListingJsonLd {
  "@type"?: string;
  itemListElement?: Array<{
    url?: string;
    image?: Array<{ url?: string }>;
  }>;
}

function parseCard(card: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): RawListingCar | null {
  const titleLink = card.find("a.cassetteMain__link").first();
  const href = titleLink.attr("href");

  if (!href) {
    return null;
  }

  const sourceUrl = new URL(href, config.SCRAPER_BASE_URL).toString();
  const sourceId = extractSourceId(sourceUrl);
  const title = normalizeWhitespace(titleLink.text());

  const imageUrls = card
    .find("img")
    .map((_, image) => $(image).attr("data-original") ?? $(image).attr("src"))
    .get()
    .filter((url): url is string => Boolean(url))
    .map((url) => (url.startsWith("//") ? `https:${url}` : url))
    .slice(0, 4);

  const specMap = new Map<string, string>();
  card.find("dt.specList__title").each((_, titleElement) => {
    const label = normalizeWhitespace($(titleElement).text());
    const value = normalizeWhitespace($(titleElement).next("dd").text());
    if (label && value) {
      specMap.set(label, value);
    }
  });

  const titleParts = title.split(" ");

  return {
    sourceId,
    sourceUrl,
    title,
    brandRaw: titleParts[0] ?? null,
    modelRaw: titleParts[1] ?? null,
    priceRaw:
      normalizeWhitespace(card.find(".basePrice__price").text()) ||
      normalizeWhitespace(card.find(".basePrice").text()) ||
      null,
    totalPriceRaw:
      normalizeWhitespace(card.find(".totalPrice__price").text()) ||
      normalizeWhitespace(card.find(".totalPrice").text()) ||
      null,
    yearRaw: specMap.get("\u5e74\u5f0f") ?? null,
    mileageRaw: specMap.get("\u8d70\u884c\u8ddd\u96e2") ?? null,
    engineCcRaw: specMap.get("\u6392\u6c17\u91cf") ?? null,
    transmissionRaw: specMap.get("\u30df\u30c3\u30b7\u30e7\u30f3") ?? null,
    imageUrls,
  };
}

export function parseListingPage(html: string) {
  const $ = cheerio.load(html);

  const items = $(".cassette.js-cassette_link, .cassette")
    .map((_, element) => parseCard($(element), $))
    .get()
    .filter((value): value is RawListingCar => Boolean(value));

  const jsonLdBlocks = loadJsonLd<ListingJsonLd>(html);
  const listBlock = jsonLdBlocks.find((block) => block["@type"] === "ItemList");

  if (items.length === 0 && listBlock?.itemListElement) {
    for (const element of listBlock.itemListElement) {
      if (!element.url) {
        continue;
      }

      items.push({
        sourceId: extractSourceId(element.url),
        sourceUrl: element.url,
        title: "",
        brandRaw: null,
        modelRaw: null,
        priceRaw: null,
        totalPriceRaw: null,
        yearRaw: null,
        mileageRaw: null,
        engineCcRaw: null,
        transmissionRaw: null,
        imageUrls: (element.image ?? []).map((image) => image.url).filter((url): url is string => Boolean(url)),
      });
    }
  }

  const nextHref =
    $(".pager__btn__next")
      .attr("onclick")
      ?.match(/location\.href='([^']+)'/)?.[1] ?? null;

  return {
    items,
    nextPageUrl: nextHref ? new URL(nextHref, config.SCRAPER_BASE_URL).toString() : null,
  };
}
