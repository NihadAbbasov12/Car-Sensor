import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CarDetails, CarListResponse, CarsQuery, LoginRequest, LoginResponse } from "@carsensor/shared";
import { sessionCookieName } from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(body.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function loginRequest(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCars(searchParams: CarsQuery): Promise<CarListResponse> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) {
    redirect("/login");
  }

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return apiFetch<CarListResponse>(`/cars?${params.toString()}`, undefined, token);
}

export async function getCar(id: string): Promise<CarDetails> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) {
    redirect("/login");
  }

  return apiFetch<CarDetails>(`/cars/${id}`, undefined, token);
}
