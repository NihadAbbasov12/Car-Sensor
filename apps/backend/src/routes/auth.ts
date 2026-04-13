import { Router } from "express";
import { login } from "../services/auth-service";
import { loginSchema } from "../validation/auth";

export const authRouter = Router();

authRouter.post("/login", async (request, response, next) => {
  try {
    const credentials = loginSchema.parse(request.body);
    const result = await login(credentials.username, credentials.password);
    response.json(result);
  } catch (error) {
    next(error);
  }
});
