import cron from "node-cron";
import { prisma } from "./lib/prisma";
import { logError, logInfo } from "./logger";
import { runScrape } from "./scraper/run-scrape";

async function runScheduledScrape() {
  try {
    await runScrape();
  } catch (error) {
    logError("Scheduled scrape failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

cron.schedule("0 * * * *", () => {
  logInfo("Hourly scrape triggered");
  void runScheduledScrape();
});

logInfo("Worker started, running initial scrape");
void runScheduledScrape();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
