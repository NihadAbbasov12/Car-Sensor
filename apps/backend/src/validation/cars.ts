import { z } from "zod";

export const carsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z
    .enum(["createdAt", "updatedAt", "priceJpy", "year", "mileageKm", "brand", "model"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  brand: z.string().trim().optional().transform((value) => value || undefined),
  model: z.string().trim().optional().transform((value) => value || undefined),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  minYear: z.coerce.number().int().min(1900).max(2100).optional(),
  maxYear: z.coerce.number().int().min(1900).max(2100).optional(),
  minMileage: z.coerce.number().int().nonnegative().optional(),
  maxMileage: z.coerce.number().int().nonnegative().optional(),
});
