import type { Response } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function sendError(response: Response, statusCode: number, message: string) {
  return response.status(statusCode).json({ message });
}
