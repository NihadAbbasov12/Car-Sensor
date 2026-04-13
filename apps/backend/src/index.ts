import cors from "cors";
import express from "express";
import { config } from "./config";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { carsRouter } from "./routes/cars";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/auth", authRouter);
app.use("/cars", authMiddleware, carsRouter);
app.use(errorHandler);

app.listen(config.BACKEND_PORT, () => {
  console.log(`Backend listening on http://localhost:${config.BACKEND_PORT}`);
});
