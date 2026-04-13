import { Router } from "express";
import { getCarById, listCars } from "../services/car-service";
import { carsQuerySchema } from "../validation/cars";

export const carsRouter = Router();

carsRouter.get("/", async (request, response, next) => {
  try {
    const query = carsQuerySchema.parse(request.query);
    const result = await listCars(query);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

carsRouter.get("/:id", async (request, response, next) => {
  try {
    const result = await getCarById(request.params.id);
    response.json(result);
  } catch (error) {
    next(error);
  }
});
