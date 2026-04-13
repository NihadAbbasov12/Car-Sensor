import { prisma } from "./lib/prisma";
import { runScrape } from "./scraper/run-scrape";

runScrape()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Manual scrape failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
