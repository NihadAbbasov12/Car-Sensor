import { config } from "../config";
import { logError, logInfo } from "../logger";
import { delay, fetchWithRetry, runConnectivityPrecheck, ScraperRequestError } from "./http";
import { parseDetailPage } from "./detail-parser";
import { parseListingPage } from "./listing-parser";
import { normalizeCar } from "./normalization";
import { persistCar } from "./persistence";

export async function runScrape() {
  const startedAt = Date.now();
  let pageUrl: string | null = new URL(config.SCRAPER_LIST_PATH, config.SCRAPER_BASE_URL).toString();
  let listingPagesAttempted = 0;
  let listingPagesSucceeded = 0;
  let carUrlsFound = 0;
  let carsParsedSuccessfully = 0;
  let carsSavedSuccessfully = 0;
  let carsSkipped = 0;
  let failures = 0;

  logInfo("Scrape started", {
    pageUrl,
    maxListPages: config.SCRAPER_MAX_LIST_PAGES,
    maxCarsPerRun: config.SCRAPER_MAX_CARS_PER_RUN,
    timeoutMs: config.SCRAPER_TIMEOUT_MS,
    delayMs: config.SCRAPER_DELAY_MS,
  });

  const precheckOk = await runConnectivityPrecheck(pageUrl);
  if (!precheckOk) {
    logError("Scrape aborted before listing fetch", {
      reason: "Target site is unreachable or too slow for the configured timeout",
      pageUrl,
    });

    logInfo("Scrape completed", {
      listingPagesAttempted,
      listingPagesSucceeded,
      carUrlsFound,
      carsParsedSuccessfully,
      carsSavedSuccessfully,
      carsSkipped,
      failures,
      durationMs: Date.now() - startedAt,
    });
    return;
  }

  while (
    pageUrl &&
    listingPagesAttempted < config.SCRAPER_MAX_LIST_PAGES &&
    carsSavedSuccessfully + carsSkipped < config.SCRAPER_MAX_CARS_PER_RUN
  ) {
    listingPagesAttempted += 1;
    logInfo("Visiting listing page", { pageUrl, page: listingPagesAttempted });

    let listingPage;

    try {
      const listingHtml = await fetchWithRetry(pageUrl);
      listingPage = parseListingPage(listingHtml);
      listingPagesSucceeded += 1;
      carUrlsFound += listingPage.items.length;
      logInfo("Listing page parsed", {
        pageUrl,
        page: listingPagesAttempted,
        carsFoundOnPage: listingPage.items.length,
        totalCarUrlsFound: carUrlsFound,
      });
    } catch (error) {
      failures += 1;
      const reason =
        error instanceof ScraperRequestError
          ? error.reason
          : error instanceof Error
            ? error.message
            : String(error);

      logError("Listing page failed, stopping scrape gracefully", {
        pageUrl,
        page: listingPagesAttempted,
        reason,
      });
      break;
    }

    for (const listingCar of listingPage.items) {
      if (carsSavedSuccessfully + carsSkipped >= config.SCRAPER_MAX_CARS_PER_RUN) {
        logInfo("Reached configured car cap for this run", {
          maxCarsPerRun: config.SCRAPER_MAX_CARS_PER_RUN,
        });
        break;
      }

      try {
        await delay();
        logInfo("Visiting detail page", { sourceId: listingCar.sourceId, sourceUrl: listingCar.sourceUrl });
        const detailHtml = await fetchWithRetry(listingCar.sourceUrl);
        const rawCar = parseDetailPage(detailHtml, listingCar);
        const normalizedCar = normalizeCar(rawCar);
        carsParsedSuccessfully += 1;
        await persistCar(normalizedCar);
        carsSavedSuccessfully += 1;
        logInfo("Car persisted", { sourceId: normalizedCar.sourceId, title: normalizedCar.title });
      } catch (error) {
        failures += 1;
        carsSkipped += 1;
        logError("Failed to scrape car", {
          sourceId: listingCar.sourceId,
          sourceUrl: listingCar.sourceUrl,
          stage:
            error instanceof ScraperRequestError
              ? "network"
              : error instanceof Error && error.message.toLowerCase().includes("parse")
                ? "parsing"
                : "detail-or-persistence",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    pageUrl = listingPage.nextPageUrl;
    if (pageUrl) {
      await delay();
    }
  }

  logInfo("Scrape completed", {
    listingPagesAttempted,
    listingPagesSucceeded,
    carUrlsFound,
    carsParsedSuccessfully,
    carsSavedSuccessfully,
    carsSkipped,
    failures,
    durationMs: Date.now() - startedAt,
  });
}
