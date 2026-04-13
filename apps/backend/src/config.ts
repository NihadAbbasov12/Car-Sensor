import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  BACKEND_PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url(),
});

export const config = envSchema.parse(process.env);
