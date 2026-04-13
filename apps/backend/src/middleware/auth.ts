import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { sendError } from "../utils/http";

interface JwtPayload {
  sub: string;
  username: string;
}

export function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return sendError(response, 401, "Missing Bearer token");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    request.user = {
      id: payload.sub,
      username: payload.username,
    };
    next();
  } catch {
    return sendError(response, 401, "Invalid or expired token");
  }
}
