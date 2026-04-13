import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SCRAPER_BASE_URL: z.string().url().default("https://www.carsensor.net/"),
  SCRAPER_LIST_PATH: z.string().min(1).default("/usedcar/freeword/%E3%83%88%E3%83%A8%E3%82%BF/index.html"),
  SCRAPER_MAX_LIST_PAGES: z.coerce.number().int().min(1).max(10).default(1),
  SCRAPER_MAX_CARS_PER_RUN: z.coerce.number().int().min(1).max(100).default(10),
  SCRAPER_TIMEOUT_MS: z.coerce.number().int().min(5000).default(60000),
  SCRAPER_DELAY_MS: z.coerce.number().int().min(200).default(1500),
});

export const config = envSchema.parse(process.env);
