import axios, { AxiosError } from "axios";
import { config } from "../config";
import { logError, logInfo } from "../logger";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1500;

export const scraperHttp = axios.create({
  timeout: config.SCRAPER_TIMEOUT_MS,
  headers: {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
  },
});

export async function delay() {
  await new Promise((resolve) => setTimeout(resolve, config.SCRAPER_DELAY_MS));
}

function getBackoffMs(attempt: number) {
  return BASE_BACKOFF_MS * 2 ** (attempt - 1);
}

function isRetriableError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || error.code === "ECONNRESET") {
    return true;
  }

  if (error.response && error.response.status >= 500) {
    return true;
  }

  return !error.response;
}

function getErrorReason(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : String(error);
  }

  if (error.code === "ECONNABORTED" || error.message.toLowerCase().includes("timeout")) {
    return `timeout after ${config.SCRAPER_TIMEOUT_MS}ms`;
  }

  if (error.code) {
    return `${error.code}${error.response ? ` (HTTP ${error.response.status})` : ""}`;
  }

  if (error.response) {
    return `HTTP ${error.response.status}`;
  }

  return error.message;
}

export class ScraperRequestError extends Error {
  url: string;
  reason: string;

  constructor(url: string, reason: string, cause?: unknown) {
    super(`Request failed for ${url}: ${reason}`);
    this.url = url;
    this.reason = reason;
    this.cause = cause;
  }
}

export async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      if (attempt > 1) {
        logInfo("Retrying request", { url, attempt, retries });
      }

      const response = await scraperHttp.get<string>(url);
      return response.data;
    } catch (error) {
      lastError = error;
      const reason = getErrorReason(error);
      const retriable = isRetriableError(error);

      logError("Request attempt failed", {
        url,
        attempt,
        retries,
        retriable,
        reason,
      });

      if (attempt < retries && retriable) {
        const backoffMs = getBackoffMs(attempt);
        logInfo("Waiting before retry", { url, backoffMs });
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      break;
    }
  }

  const reason = getErrorReason(lastError);
  logError("Request failed after retries", { url, retries, reason });
  throw new ScraperRequestError(url, reason, lastError);
}

export async function runConnectivityPrecheck(url: string) {
  try {
    logInfo("Running connectivity precheck", { url });
    await fetchWithRetry(url, 1);
    logInfo("Connectivity precheck succeeded", { url });
    return true;
  } catch (error) {
    const reason = error instanceof ScraperRequestError ? error.reason : getErrorReason(error);
    logError("Connectivity precheck failed", { url, reason });
    return false;
  }
}
